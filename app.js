require('dotenv').config();
const express = require('express');
const status = require('http-status');
const app = express();
const path = require('path');

const { init, getAdvs, getAdv, deleteAdv, addAdv, filterByAuthor } = require('./db');

app.use(express.json());

init().then(() => {
    app.get('/advs', async (req, res) => {
        const advs = await getAdvs();
        res.send(advs);
    });

    app.get('/advs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const adv = await getAdv(id);

        if (adv) {
            res.send(adv);
        }
        } catch (err){
          console.log(err)
        }

        res.statusCode = status.NOT_FOUND;
        res.send();
    });

    app.post('/advs', async (req, res) => {
    try{
        const newAdv = req.body;
        const result = await addAdv(newAdv);
      
        if (result.insertedCount === 1) {
            res.statusCode = status.CREATED;
        }
    } catch (err){
        console.log(err)
        res.statusCode = status.INTERNAL_SERVER_ERROR
    }
        res.send();
    });

    app.delete('/advs/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const result = await deleteAdv(id);

        if (result.deletedCount == 1){
            res.statusCode = status.NO_CONTENT;
        }
        } catch (err) {
        console.log(err)
        } 
        res.statusCode = status.NOT_FOUND;
        res.send();
    });

    app.get('/advs/:author', async (req, res) => {
        try {
            const { author } = req.params;
            const authors = await filterByAuthor(author);
    
            if (authors) {
                res.send(authors);
            }
        } catch (err){
              console.log(err)
            }
    
            res.statusCode = status.NOT_FOUND;
            res.send();
        });
})
.finally(() => {
    app.get('/heartbeat', (req, res) => {
        res.send(new Date());
    });
    
    app.use("*", express.static(path.join(__dirname, "img/image.gif")));

    app.listen(process.env.PORT, () => console.log('server started'));
});
