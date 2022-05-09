const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var aws = require('aws-sdk');

// configs
app.use(bodyParser.json())
const _AWS_PATH = 'images/'
const _PORT = 8000;

const uploadFile = (imageBuffer, filePath) => {
    return new Promise((resolve, reject) => {
      let s3 = new aws.S3({
        credentials: {
            accessKeyId: "AKIA4SMYWOG35YNP2F6S",
            secretAccessKey: "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"
        },
        region: "eu-central-1",
      });
  
      const bucketName = "howgut";
      let bucketPath = filePath;
  
      let params = {
        Bucket: bucketName,
        Key: bucketPath,
        Body: imageBuffer,
      };
      s3.putObject(params, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          resolve(true);
        }
      });
    });
  };
const getFile = (fileName) => {
    return new Promise((resolve, reject) => {
    const s3 = new aws.S3(
        { 
            region: 'eu-central-1', credentials: {
                accessKeyId: 'AKIA4SMYWOG35YNP2F6S',
                secretAccessKey: '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'
            } 
        }
    );

    var getParams = {
        Bucket: 'howgut',
        Key: fileName
    }

    s3.getObject(getParams, function(err, data) {
        if (err)
            return console.log(err);;

    // No error happened
    // Convert Body from a Buffer to a String
    return resolve(data.Body.toString('base64')); // Use the encoding necessary
    });   
});
}
const deleteFile = async (fileName) => {
    const s3 = new aws.S3(
        { 
            region: 'eu-central-1', credentials: {
                accessKeyId: 'AKIA4SMYWOG35YNP2F6S',
                secretAccessKey: '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'
            } 
        })
    const params = {
        Bucket: 'howgut',
        Key: fileName,
    }
    await s3.deleteObject(params).promise()
}
// const base64ToBuffer = (base64) => {
//       var binary_string = Buffer.from(base64, 'base64');
//       var len = binary_string.length;
//       var bytes = new Uint8Array(len);
//       for (var i = 0; i < len; i++) {
//           bytes[i] = binary_string.charCodeAt(i);
//       }
//       return bytes.buffer;
// }


// models
const Users = require('./Models/Users');
const Recipes = require('./Models/Recipes');
const Sequelize = require('sequelize');


app.post('/authenticate', async (req, res) => {
    
    // var buffer = base64ToBuffer(base64String)
    // await uploadFile(buffer, `${filename}-${Date.now()}${extention}`);

    // getFile('namespace.png')
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

    // deleteFile('namespace.png')
    //     .then(data => {
    //         console.log("Deleted");
    //     })
    //     .catch(err =>{
    //         console.log('shit happens');
    //     })

    // s3Client.deleteFile('Untitled2.png')
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err))


    const {username, password} = req.body.authentication;
    Users.findOne({
        where: {
            UserName: username
        }
    })
        .then(data => {
            if(data.dataValues.Password == password)
                return res.json({user: data})
            else{
                return res.send("Your username or password are incorrect!").status(400);
            }
        })
        .catch(err => {
            res.send(err)
            res.status(400);
        })

})

app.post('/createRecept', async (req, res) => {
    let {name, contentText, base64Image, fileName, uploadedBy} = req.body;

    base64ImageInfo = base64Image.split(',')[0];
    base64Image = base64Image.split(',')[1];
    var fileNameIndex = fileName.lastIndexOf('.');
    realFileName = fileName.substring(0, fileNameIndex);
    extention = fileName.substring(fileNameIndex);
    var filePath = `${_AWS_PATH}${realFileName}-${Date.now()}${extention}`;
    var fileUploaded = await uploadFile(Buffer.from(base64Image, 'base64'), filePath);

    if (fileUploaded) {
        console.log(filePath);
    }
    else{
        return console.log("Shit happens");
    }

    Recipes.create({
        Name: name,
        ContentText: contentText,
        ImageBase64Info: base64ImageInfo + ',',
        ImageUrl: filePath,
        UploadedBy: 1
    })
        .then(data => {
            res.json({responseStatus: 200, content: data})
        })
        .catch(err => {
            res.send('Shit happens').status(500);
            console.log(err);
        })
})
app.get('/getReceptById', async (req, res) => {
    const {id} = req.query;
    console.log(id);
    Recipes.findOne({
        where: {
            Id: id,
            IsDeleted: false
        }
    })
        .then(async (data) => {
            console.log('we are here');
            let image = data.dataValues.ImageBase64Info + await getFile(data.dataValues.ImageUrl);
            console.log('but i guess not here...');
            data.dataValues.base64Image = image;
            res.json(data);
        })
        .catch(err => {
            res.send(err).status(401);
        })
})
app.put('/updateRecept', async (req, res) => {
    let {id, name, contentText, base64Image, fileName, uploadedBy} = req.body;
    if(!deleteFile(fileName)){
        return res.json('shit happend again.')
    }
    
    base64ImageInfo = base64Image.split(',')[0];
    base64Image = base64Image.split(',')[1];
    var fileNameIndex = fileName.lastIndexOf('.');
    realFileName = fileName.substring(0, fileNameIndex);
    extention = fileName.substring(fileNameIndex);
    var filePath = `${_AWS_PATH}${realFileName}-${Date.now()}${extention}`;
    var fileUploaded = await uploadFile(Buffer.from(base64Image, 'base64'), filePath);

    if (fileUploaded) {
        console.log(filePath);
    }
    else{
        return console.log("Shit happens");
    }

    Recipes.update({
            Name: name,
            ContentText: contentText,
            ImageUrl: filePath,
            UploadedBy: 1,
            IsDeleted: false
        },{
            where: {
                Id: id
            }
        })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            })
})
app.delete('/deleteRecept', async (req, res) => {
    const {id} = req.query;
    Recipes.findOne({
        where: {
            Id: id
        }
    })
        .then(data => {
            deleteFile(data.dataValues.ImageUrl)
                .then(x => {
                    Recipes.destroy({
                            where: {
                                Id: id
                            }
                        })
                        .then(data2 => {
                            res.json({msg: 'Recept is deleted successfully!'})
                        })
                        .catch(err => {
                            console.log('well...shit happens :).');
                        })
                })
                .catch(err =>{
                    console.log('shit happens');
                })
        })
    
    
})



app.listen(_PORT, () => {
    console.log(`Listening to port: ${_PORT}`);
})