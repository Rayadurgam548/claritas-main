const agentsRoutes = require('./src/api/routes/agents');
const indexRoutes = require('./src/api/routes/index');

console.log("Agents Routes details:", typeof agentsRoutes, agentsRoutes.stack?.length);
console.log("Index Routes details:", typeof indexRoutes, indexRoutes.stack?.map(layer => layer.regexp));
