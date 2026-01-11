import { getMainCourses } from "@/app/api/menu/menu";
import { PopularDishesSection } from "./popular-dishes-section";

export default async function PopularDishesClient() {
  const data = await getMainCourses();
  console.log("Fetched Main Courses Data:", data);
  return <PopularDishesSection items={data?.data?.items || []} />;
}
