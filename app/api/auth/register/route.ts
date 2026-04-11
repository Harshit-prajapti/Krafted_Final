import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    fullName: z.string().min(2),
    phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Validation
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation Failed", details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { password, confirmPassword, fullName, phone } = validation.data;
        const normalizedEmail = validation.data.email.trim().toLowerCase();

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        // 2. Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: 'insensitive'
                }
            }
        });

        if (existingUser) {
            if (!existingUser.password) {
                const hashedPassword = await bcrypt.hash(password, 10);

                const updatedUser = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        password: hashedPassword,
                        name: existingUser.name || fullName,
                        phone: existingUser.phone || phone || null,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        createdAt: true
                    }
                });

                return NextResponse.json({
                    ...updatedUser,
                    message: "Password set for your existing account. Please sign in."
                }, { status: 200 });
            }

            return NextResponse.json({
                error: "User already exists with this email. Please sign in or reset your password."
            }, { status: 409 });
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User
        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name: fullName,
                password: hashedPassword,
                phone: phone || null,
                role: 'USER' // Default role
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error('[REGISTER_ERROR]', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
