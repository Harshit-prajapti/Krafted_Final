'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddressSelection from './AddressSelection'
import PaymentStep from './PaymentStep'
import CheckoutSummary from './CheckoutSummary'
import { Check, Loader2 } from 'lucide-react'

declare global {
    interface Window {
        Razorpay: any
    }
}

interface CheckoutClientProps {
    initialCart: any
    initialAddresses: any[]
    userEmail?: string | null
    isPaymentTestMode: boolean
}

import { useTranslation } from 'react-i18next'

export default function CheckoutClient({
    initialCart,
    initialAddresses,
    userEmail,
    isPaymentTestMode,
}: CheckoutClientProps) {
    const { t } = useTranslation('checkout')
    const { t: tCommon } = useTranslation('common')
    const [step, setStep] = useState<'ADDRESS' | 'PAYMENT'>('ADDRESS')
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        initialAddresses.find(a => a.isDefault)?.id || initialAddresses[0]?.id || null
    )
    const subtotal = initialCart.subtotal
    const tax = subtotal * 0.18
    const total = subtotal + tax
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'creating' | 'processing' | 'verifying'>('idle')
    const router = useRouter()

    const initializeRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const redirectToFailure = (orderId: string, reason: string) => {
        router.push(`/checkout/failed?orderId=${orderId}&reason=${encodeURIComponent(reason)}`)
    }

    const handlePlaceOrder = async (paymentMethod: string) => {
        if (!selectedAddressId) return

        setIsProcessing(true)
        setPaymentStatus('creating')

        let shouldResetState = true

        try {
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    paymentMethod
                })
            })

            if (!orderRes.ok) {
                const err = await orderRes.json()
                alert(err.error || t('errors.failedToCreateOrder', 'Failed to create order'))
                return
            }

            const order = await orderRes.json()
            const selectedAddress = initialAddresses.find(a => a.id === selectedAddressId)

            if (paymentMethod === 'COD') {
                shouldResetState = false
                router.push(`/checkout/success?orderId=${order.id}`)
                router.refresh()
                return
            }

            setPaymentStatus('processing')

            const paymentRes = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order.id })
            })

            const paymentData = await paymentRes.json()

            if (!paymentRes.ok) {
                alert(paymentData.error || t('errors.paymentInitFailed', 'Failed to initialize payment. Please try again.'))
                return
            }

            if (paymentData.mode !== 'TEST' && (!paymentData.keyId || !paymentData.razorpayOrderId)) {
                alert(t('errors.paymentInitFailed', 'Failed to initialize payment. Please try again.'))
                return
            }

            if (paymentData.mode === 'TEST') {
                setPaymentStatus('verifying')

                const verifyRes = await fetch('/api/payments/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: order.id,
                        paymentMode: 'TEST',
                        testPaymentId: paymentData.testPaymentId,
                        testOrderId: paymentData.testOrderId,
                    })
                })

                if (verifyRes.ok) {
                    shouldResetState = false
                    router.push(`/checkout/success?orderId=${order.id}&paymentId=${paymentData.testPaymentId}`)
                    router.refresh()
                } else {
                    redirectToFailure(order.id, 'verification_failed')
                }
                return
            }

            const razorpayLoaded = await initializeRazorpay()
            if (!razorpayLoaded) {
                alert(t('errors.paymentGatewayFailed', 'Failed to load payment gateway. Please try again.'))
                return
            }

            const options = {
                key: paymentData.keyId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: 'Krafted Furniture',
                description: `${t('order', 'Order')} #${order.id.slice(-8).toUpperCase()}`,
                order_id: paymentData.razorpayOrderId,
                prefill: {
                    name: selectedAddress?.fullName || '',
                    contact: selectedAddress?.phone || '',
                    email: userEmail || ''
                },
                theme: {
                    color: '#000000',
                    backdrop_color: 'rgba(0,0,0,0.8)'
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false)
                        setPaymentStatus('idle')
                    }
                },
                handler: async (response: any) => {
                    setPaymentStatus('verifying')

                    try {
                        const verifyRes = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: order.id
                            })
                        })

                        if (verifyRes.ok) {
                            router.push(`/checkout/success?orderId=${order.id}&paymentId=${response.razorpay_payment_id}`)
                            router.refresh()
                        } else {
                            redirectToFailure(order.id, 'verification_failed')
                        }
                    } catch (error) {
                        console.error('Verification error:', error)
                        redirectToFailure(order.id, 'verification_error')
                    }
                }
            }

            const razorpay = new window.Razorpay(options)

            razorpay.on('payment.failed', async (response: any) => {
                console.error('Payment failed:', response.error)

                try {
                    await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId: order.id,
                            paymentStatus: 'FAILED',
                            razorpay_order_id: response.error?.metadata?.order_id,
                            razorpay_payment_id: response.error?.metadata?.payment_id,
                            errorCode: response.error?.code,
                            errorDescription: response.error?.description,
                        })
                    })
                } catch (failureError) {
                    console.error('Failed to persist payment failure:', failureError)
                }

                redirectToFailure(order.id, response.error?.code || 'payment_failed')
            })

            razorpay.open()

        } catch (error) {
            console.error(error)
            alert(tCommon('errors.somethingWentWrong', 'Something went wrong. Please try again.'))
        } finally {
            if (shouldResetState) {
                setIsProcessing(false)
                setPaymentStatus('idle')
            }
        }
    }

    const getStatusText = () => {
        switch (paymentStatus) {
            case 'creating': return t('status.creatingOrder', 'Creating order...')
            case 'processing': return t('status.initializingPayment', 'Initializing payment...')
            case 'verifying': return t('status.verifyingPayment', 'Verifying payment...')
            default: return t('status.processing', 'Processing...')
        }
    }

    return (
        <>
            {isProcessing && paymentStatus !== 'idle' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">{getStatusText()}</h3>
                        <p className="text-gray-500 text-sm">{t('messages.doNotClose', 'Please wait while we process your request. Do not close this window.')}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <nav aria-label="Progress" className="mb-8">
                        <ol role="list" className="flex items-center">
                            <li className="relative pr-8 sm:pr-20">
                                <div className="flex items-center" aria-current={step === 'ADDRESS' ? 'step' : undefined}>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${step === 'ADDRESS'
                                        ? 'border-black bg-white ring-4 ring-black/5 shadow-lg'
                                        : 'border-green-600 bg-green-600 shadow-lg shadow-green-200'
                                        }`}>
                                        {step === 'PAYMENT' ? (
                                            <Check className="h-6 w-6 text-white" />
                                        ) : (
                                            <span className="text-black font-bold text-lg">1</span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-bold uppercase tracking-wider text-gray-900">{t('steps.shipping', 'Shipping')}</p>
                                        <p className="text-xs text-gray-500">{t('steps.deliveryAddress', 'Delivery address')}</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 left-12 h-0.5 w-full bg-gradient-to-r from-gray-200 to-transparent" aria-hidden="true" />
                            </li>
                            <li className="relative">
                                <div className="flex items-center" aria-current={step === 'PAYMENT' ? 'step' : undefined}>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${step === 'PAYMENT'
                                        ? 'border-black bg-white ring-4 ring-black/5 shadow-lg'
                                        : 'border-gray-200 bg-gray-50'
                                        }`}>
                                        <span className={step === 'PAYMENT' ? 'text-black font-bold text-lg' : 'text-gray-400 font-bold text-lg'}>2</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className={`text-sm font-bold uppercase tracking-wider ${step === 'PAYMENT' ? 'text-gray-900' : 'text-gray-400'}`}>{t('steps.payment', 'Payment')}</p>
                                        <p className="text-xs text-gray-500">{t('steps.secureCheckout', 'Secure checkout')}</p>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {step === 'ADDRESS' ? (
                        <AddressSelection
                            addresses={initialAddresses}
                            selectedId={selectedAddressId}
                            onSelect={setSelectedAddressId}
                            onNext={() => setStep('PAYMENT')}
                        />
                    ) : (
                        <PaymentStep
                            onBack={() => setStep('ADDRESS')}
                            onPlaceOrder={handlePlaceOrder}
                            isProcessing={isProcessing}
                            totalAmount={total}
                            isTestMode={isPaymentTestMode}
                        />
                    )}
                </div>

                <div className="lg:col-span-4">
                    <CheckoutSummary cart={initialCart} />
                </div>
            </div>
        </>
    )
}
