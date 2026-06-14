const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$connect().then(() => {
  console.log('Prisma connected OK');
  return p.tool.count();
}).then(count => {
  console.log('Tool count:', count);
  return p.$disconnect();
}).then(() => {
  console.log('Done');
}).catch(e => {
  console.error('Prisma error:', e.message);
  process.exit(1);
});
