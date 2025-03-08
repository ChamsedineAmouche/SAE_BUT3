const fs = require('fs');
const path = require('path');

module.exports = (app, routesDir) => {
    const absolutePath = path.resolve(routesDir);
    fs.readdirSync(absolutePath).forEach(file => {
        if (file.endsWith('.js')) {
            const route = require(path.join(absolutePath, file));
            if (typeof route === 'function') {
                app.use(route);
                //console.log(`Route loaded: ${file}`);
            } else {
                console.error(`Invalid route file: ${file}. Ensure it exports a middleware function.`);
            }
        }
    });
};
