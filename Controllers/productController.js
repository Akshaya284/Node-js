const productServices = require("../Services/productServices");
const multer = require('multer');

const upload = multer({dest : "uploads",
fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024, // 1MB maximum file size
  },
});

exports.createProduct = [
  upload.single("productImage"),
  async (req, res, next) => {
      const { productName, productCode, manufacturer, price, stock } = req.body;

      const userRole = req.user.role;

      if (!productCode || productCode.trim() === "" || productCode === null) {
          return res.status(400).json({ message: "Product code is required" });
      }

      if (userRole !== "admin") {
          return res.status(403).json({ message: "Unauthorized. Only admins can create products" });
      }

      try {
          const result = await productServices.createProduct({
              productName,
              productCode,
              manufacturer,
              price,
              stock
          });

          if (req.file) {
              result.productImage = req.file.path;
          }

          return res.status(201).json({ message: "Product created successfully", data: result });
      } catch (error) {
          return res.status(500).json({ message: "Error creating product", error: error.message });
      }
  }
];

exports.editProduct = [
  upload.single("productImage"), // Apply multer middleware here
  async (req, res) => {
    const productId = req.params.id;
    const userRole = req.user.role;

    if(userRole !== "admin") {
      res.status(404).json({message : "Unauthorized. Only admins can edit products"})
    }

    const { productName, manufacturer, price, stock } = req.body;

    const updatedFields = {
      productName,
      manufacturer,
      price,
      stock,
    };

    if (req.file) {
      updatedFields.productImage = req.file.path;
    }

    try {

      
      const updatedProduct = await productServices.editProduct(productId, updatedFields);
      return res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
      return res.status(500).json({ message: "Error updating product", error: error.message });
    }
  }
];

exports.getProductById = async (req, res, next) => {
    const productId = req.params.id;
    const userRole = req.user.role;

    // if(userRole !== "admin") {
    //   res.status(404).json({message : "Unauthorized. Only admins can view products"})
    // }

    try {
      const product = await productServices.getProductById(productId);
      if (!product) {
        throw new Error("Product not found")
      };
      return res.status(201).json({message : "Product retrieved successfully", data : product});
    }
    catch (error) {
      return res.status(500).json({message : "Error retrieving product detail", error :error.message})
    }
};

exports.getProducts = async (req, res, next) => {
  const { search } = req.query;
  const userRole = req.user.role; 

  // if (userRole !== "admin") {
  //     return res.status(403).json({ message: "Unauthorized. Only admins can view products." });
  //   }

  try {
      const product = await productServices.getProducts( search );
      if (product.length === 0) {
          return res.status(401).json({message : "Product not found"})
      }
      return res.status(200).json({ message: "Products retrieved successfully.", data: product });
  } catch (error) {
      console.error("Error retrieving products:", error);
      return res.status(500).json({ message: "Error retrieving products.", error: error.message });
  }
};

exports.deleteProductById = async (req, res, next) => {
   const productId = req.params.id;
   const userRole = req.user.role;

   if(userRole !== "admin") {
    return res.status(403).json({message : "unauthorized. Only admins can delete coupons"});
   }
   try {
    const deletedProduct = await productServices.deleteProductById(productId);
    return res.status(200).json({ message: "Product deleted successfully.", data: deletedProduct });
    } catch (error) {
        console.error("Error deleting Product");
        return res.status(500).json({ message: "Error deleting product.", error: error.message });
    }
}
