import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";

export default function HomePage() {
  return (
    <>

      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
    </>
  );
}
