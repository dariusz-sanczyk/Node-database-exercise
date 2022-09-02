const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

const url = process.env.MONGODB_CONNECTION;

const AdvCollectionName = 'adverts';

let db;
let advsCollection;

const init = () =>
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        .then((client) => {
            db = client.db(process.env.MONGODB_DBNAME);
            advsCollection = db.collection(AdvCollectionName);
        })
        .catch(error => console.log(error));

const getAdvs = () => {
    return advsCollection.find().toArray();
}

const getAdv = (id) => {
    return advsCollection.findOne({ _id: new ObjectId(id) });
}

const deleteAdv = (id) => {
    return advsCollection.deleteOne({ _id: new ObjectId(id) });
}

const addAdv = (newAdv) => {
    return advsCollection.insertOne(newAdv);
}
const filterByAuthor = (name) => {
    return advsCollection.find({author: name});
}


module.exports = { init, getAdvs, getAdv, deleteAdv, addAdv, filterByAuthor };
