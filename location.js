const fetch = require("node-fetch");
const Sequelize = require('sequelize');
const axios = require('axios');

const token = 'pk.eyJ1IjoieWFrb3ZsZXZmcm9udGVuZCIsImEiOiJja2IzZXQ2amIwZTJzMzJ0ODNkbjM5cHplIn0.McJ1QES2k_kA3vKALtx-iA';
// or we can load data from bigQuery?
const data = require('./users');

// db, user, password
const sequelize = new Sequelize('locations', 'lonya', '', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

const locationModel = sequelize.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    location: Sequelize.STRING,
    reputation: Sequelize.INTEGER,
    mapbox: Sequelize.JSON
}, {
    timestamps: false
});
// clear table
// locationModel.destroy({ truncate: true , restartIdentity: true });
// help function
const loadLocation = async (token, location) => {
    let res = location ? `${location}.json` : '';
    let locationToUrl = encodeURI(res);
    try {
        let load = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${locationToUrl}?access_token=${token}`);
        let result = await load.data;
        return result
    } catch (e) {
        console.log(e);
        return null;
    }
};

(async function() {
    for (let i = 0; i < data.length; i++) {
        try {
            let mapbox = await loadLocation(token, data[i].location) || null;
            if (mapbox) {
                let ob = {
                    id: data[i].id,
                    location: data[i].location,
                    reputation: data[i].reputation,
                    mapbox: mapbox,
                };
                locationModel.create(ob);
            }
        } catch (e) {
            console.log(e);
        }
        console.log(i);
    }
})();




