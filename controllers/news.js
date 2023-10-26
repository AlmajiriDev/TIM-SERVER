const { default: mongoose } = require("mongoose");
const {Post} = require("../models/NewsAndBroadcasts/newsPost");
const {BroadCast} = require("../models/NewsAndBroadcasts/broadcast");
const uploadImage = require('../middlewares/cloudinaryUpload')
const { User } = require("../models/user");
    
//News section
exports.getAllNews = async (req, res, next) => {
    try {
        const news = await Post.find();
        return res.status(200).json({ news });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

//get 4 latest broadcast
exports.getAllNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 

        const totalNewsCount = await Post.countDocuments();
        const totalPages = Math.ceil(totalNewsCount / limit);
        
        const news = await Post.find({}, { createdBy: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .sort({ createdAt: -1 }) 
            .skip((page - 1) * limit)
            .limit(limit); // Limit the number of news per 
        
        return res.status(200).json({ news, totalPages });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.postNews = async (req, res, next) => {
   try {
    const { _id } = req.payload;
    const userId = mongoose.Types.ObjectId(_id);

    const {title, description, author} = req.body
    
    const imageUrl = await uploadImage(req.file, {
        folder: 'news-images', 
        public_id: `tim-news-${userId}`, 
        overwrite: true, 
        resource_type: 'auto', 
      });
    
    let post = await Post.create({title: title, description: description, author: author, image: imageUrl, createdBy: userId})
    if (post){
        return res.status(201).json({ message: "News Post created" });
    }
    } catch (err) {
        if (!err.statusCode) {
        err.statusCode = 500;
        }
        next(err);
      }
}


exports.updateNews = async (req, res, next) => {
    try {
        const { _id } = req.payload;
        const userId = mongoose.Types.ObjectId(_id);
        const postId = req.params.postId;
        
        Post.findById(postId, async(err, post) =>{
            if(err){
                return res.status(404).json({message: "Post Not Found!"})
            }
            post.title = req.body.title !== "" ? req.body.title : post.title
            post.description = req.body.description !== "" ? req.body.description : post.description
            post.author = req.body.author !== "" ? req.body.author : post.author
            if(req.file){
                const imageUrl = await uploadImage(req.file, {
                    folder: 'news-images', 
                    public_id: `tim-news-${userId}`, 
                    overwrite: true, 
                    resource_type: 'auto', 
                  });
                post.image = req.file.image !== "" ? imageUrl : post.image
            }
            post.save((err)=>{
                if (err) { 
                    console.error(err);
                    const errMessage = "Something went wrong, please try again!";
                    return res.status(500).json({ message: errMessage });
                  } else {
                    return res.status(201).json({ message: "Post Updated Successfully" });
                  }
            })
        })
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
}




exports.deleteNews = async (req, res, next) => {
    try {
        const postId = req.params.psotId;
        
        // Find the post by ID and delete it
        const deletedPost = await Post.findByIdAndDelete(postId);
    
        if (!deletedPost) {
          return res.status(404).json({ message: "Post not found" });
        }
    
        return res.status(200).json({ message: "Post deleted successfully" });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
}

//Broadcasts section
exports.getAllBroadcast = async (req,res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 

        const totalBcCount = await BroadCast.countDocuments();
        const totalPages = Math.ceil(totalBcCount / limit);
        
        const bc = await BroadCast.find({}, { createdBy: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .sort({ createdAt: -1 }) 
            .skip((page - 1) * limit)
            .limit(limit); // Limit the number of news per 
        
        return res.status(200).json({ bc, totalPages });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getAllApprovedBroadcasts = async (req, res, next) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const totalBcCount = await BroadCast.countDocuments({ approved: true });
      const totalPages = Math.ceil(totalBcCount / limit);

      const approvedBc = await BroadCast.find({ approved: true }, { createdBy: 0, createdAt: 0, updatedAt: 0, __v: 0 })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

      return res.status(200).json({ approvedBc, totalPages });
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
}

exports.postBroadcast = async (req, res, next)  => {
    try {
        const { _id } = req.payload;
        const userId = mongoose.Types.ObjectId(_id);
    
        const {title, description} = req.body
        let author;

        User.findById(userId, 'firstName lastName', (err, user) => {
            if (err) {
              const error = new Error('Failed to retrieve user');
              error.statusCode = 500;
              return next(error);
            }  
            author = `${user.firstName} ${user.lastName}`;
        })

        const imageUrl = await uploadImage(req.file, {
            folder: 'BCs-images', 
            public_id: `tim-BCs-${userId}`, 
            overwrite: true, 
            resource_type: 'auto', 
          });
    
        let bc = await BroadCast.create({title: title, description: description, author: author, image: imageUrl})
        if (bc){
            return res.status(201).json({ message: "News Post created" });
        }
        } catch (err) {
            if (!err.statusCode) {
            err.statusCode = 500;
            }
            next(err);
          }
}





exports.updateBroadcast = async (req, res, next) => {
    try {
      const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      const bcId = req.params.bcId;
  
      BroadCast.findById(bcId, async (err, bc) => {
        if (err) {
          return res.status(404).json({ message: "BC Not Found!" });
        } else if(bc.approved === true) {
          return res.status(400).json({ message: "BC Cannot be edited, contact admin!" });
        }
        bc.title = req.body.title !== "" ? req.body.title : bc.title;
        bc.description = req.body.description !== "" ? req.body.description : bc.description;
        if (req.file) {
          const imageUrl = await uploadImage(req.file, {
            folder: 'BCs-images',
            public_id: `tim-BCs-${userId}`,
            overwrite: true,
            resource_type: 'auto',
          });
          bc.image = req.file.image !== "" ? imageUrl : bc.image;
        }
        bc.save((err) => {
          if (err) {
            console.error(err);
            const errMessage = "Something went wrong, please try again!";
            return res.status(500).json({ message: errMessage });
          } else {
            return res.status(201).json({ message: "BC Updated Successfully" });
          }
        });
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  



exports.deleteBroadcast = async (req, res, next)  => {
    try {
        const bcId = req.params.bcId;
        
        // Find the post by ID and delete it
        const deletedBc = await BroadCast.findByIdAndDelete(bcId);
    
        if (!deletedBc) {
          return res.status(404).json({ message: "BC not found" });
        }
    
        return res.status(200).json({ message: "BC deleted successfully" });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }

}

exports.approveBC = async (req, res, next) =>{
  try {                                                                                                                                      
    const bcId = req.params.bcId;

    const bcApproved = BroadCastfindByIdAndUpdate(bcId, { approved: true }, { new: true }, async (err, bc) => {
      if (err) {
        return res.status(404).json({ message: "BC Not Found!" });
      } else if(bc.approved === true) {
        return res.status(400).json({ message: "Already Approved!" });
      }
      
      if (bcApproved) {
        return res.status(201).json({ message: "BC Approved Successfully" });
      } else {
        return res.status(500).json({ message: "something went wrong, try again" });
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.disApproveBC = async (req, res, next) =>{
  try {
    const bcId = req.params.bcId;

    const bcDisapproved = BroadCastfindByIdAndUpdate(bcId, { approved: false }, { new: true }, async (err, bc) => {
      if (err) {
        return res.status(404).json({ message: "BC Not Found!" });
      } else if(bc.approved === false) {
        return res.status(400).json({ message: "Already Disapproved!" });
      }
      
      if (bcDisapproved) {
        return res.status(201).json({ message: "BC Disapproved Successfully" });
      } else {
        return res.status(500).json({ message: "something went wrong, try again" });
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.subscribeNewsLetter = async (req, res, next) => {}