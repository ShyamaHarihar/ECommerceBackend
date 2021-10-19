const devkeys = require("./dev");
const prodkeys = require("./prod");
switch (process.env.NODE_ENV) {
    case "production":
        module.exports = prodkeys;
        break;
    case "development":
        module.exports = devkeys;
        break;
    default:
        break;
}