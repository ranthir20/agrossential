import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const expert = await prisma.user.upsert({
    where: {
      id: "test-expert",
    },
    update: {
      role: "EXPERT",
    },
    create: {
      id: "test-expert",
      name: "Test Agricultural Expert",
      email: "testexpert@example.com",
      role: "EXPERT",
      language: "en",
    },
  });

  console.log("Created/verified test expert:", expert);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
