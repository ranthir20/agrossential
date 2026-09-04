import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: {
      id: "test-farmer",
    },
    update: {},
    create: {
      id: "test-farmer",
      name: "Test Farmer",
      email: "testfarmer@example.com",
      role: "FARMER",
      language: "en",
    },
  });

  console.log("Created/verified test user:", user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
