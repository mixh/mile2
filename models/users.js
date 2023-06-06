import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import axios from "axios";

export const create = async (
  uniqueCode,
  name,
  address,
  productNames,
  discountPercentages
) => {
  let user = {
    uniqueCode: uniqueCode,
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    products: [],
  };

  for (let i = 0; i < productNames.length; i++) {
    const productName = productNames[i].toLowerCase();
    const discountPercentage = discountPercentages[i];
    const product = {
      productName: productName,
      ProductDiscountPercentage: discountPercentage,
    };
    user.products.push(product);
  }

  const userCollection = await users();

  const existingUser = await userCollection.findOne({ uniqueCode: uniqueCode });
  if (existingUser) {
    throw new Error("User Code already exists");
  }

  const insertInfo = await userCollection.insertOne(user);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error("Could not add user");
  }
  const newId = insertInfo.insertedId.toString();
  const newUser = await get(newId);
  return newUser;
};


export const get = async (id) => {
  const userCollection = await users();
  const u = await userCollection.findOne({ _id: new ObjectId(id) });
  if (u == null) throw new Error ("no such user found");
  u._id = u._id.toString();
  return u;
};

export const getByUniqueCode = async (uniqueCode) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ uniqueCode: uniqueCode });

  if (!user) {
    throw new Error("User not found");
  }

  user._id = user._id.toString();
  return user;
};
