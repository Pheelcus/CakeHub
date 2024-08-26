import Ingredient from "../models/Ingredient.js";
import Order from "../models/Order.js";
import { ObjectId } from 'mongodb';

const ingredientController = {};

ingredientController.getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find().lean().exec();
        return res.status(200).json({
            status: 'SUCCESS',
            data: ingredients
        });
    }
    catch (error) {
        return res.status(404).json({
            status: 'ERROR',
            message: error.message
        });
    };
};

ingredientController.addIngredient = async (req, res) => {
    try {
        const { ingredient } = req.body;

        const ingredientExist = await Ingredient.findOne({ ingredientID: ingredient.id });
        if (ingredientExist) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Ingredient already exist'
            });
        }
        const newIngredient = await Ingredient.create(
            {
                ingredientID: ingredient.id,
                ingredientName: ingredient.name,
                ingredientPerPrice: ingredient.price,
                ingredientUnit: ingredient.unit,
                ingredientQuantity: ingredient.quantity,
                ingredientPerQuantity: ingredient.perquantity,
                expired: ingredient.expiryDate
            }
        );

        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Ingredient was added successfully',
            device: newIngredient
        });

    } catch (error) {
        return res.status(404).json({
            status: 'ERROR',
            message: error.message
        });
    }
}

ingredientController.updateIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const { name, price, unit, quantity, perquantity, expiryDate } = req.body;
        const ingredient = await Ingredient.findOneAndUpdate({ ingredientID: id }, {
            ingredientName: name,
            ingredientPerPrice: price,
            ingredientPerQuantity: perquantity,
            ingredientUnit: unit,
            ingredientQuantity: quantity,
            expired: expiryDate
        }, { new: true });
        return res.status(200).json({
            status: 'SUCCESS',
            data: ingredient
        });
    }
    catch (error) {
        return res.status(400).json({
            status: 'ERROR',
            message: error.message
        });
    };

};

ingredientController.deleteIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        await Ingredient.deleteOne({ ingredientID: id });
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Ingredient was deleted successfully'
        });
    }
    catch (error) {
        return res.status(404).json({
            status: 'ERROR',
            message: error.message
        });
    };
}

ingredientController.calculateIngredients = async (req, res) => {
    try {
        const orderID = new ObjectId(req.params.orderid);
        const remaining_ingred_list = await Order.aggregate([
            {
                $match: {
                    _id: orderID
                }
            },
            { $unwind: "$cakes" },
            {
                $lookup: {
                    from: "cakes",
                    localField: "cakes.cake_id",
                    foreignField: "cakeID",
                    as: "cakeDetail"
                }
            },
            { $unwind: "$cakeDetail" },
            {
                $lookup: {
                    from: "recipes",
                    localField: "cakeDetail.recipe_id",
                    foreignField: "recipeID",
                    as: "recipeDetail"
                }
            },
            { $unwind: "$recipeDetail" },
            { $unwind: "$recipeDetail.ingredients" },
            {
                $lookup: {
                    from: "ingredients",
                    localField:
                        "recipeDetail.ingredients.ingredID",
                    foreignField: "ingredientID",
                    as: "ingredientDetail"
                }
            },
            {
                $unwind: "$ingredientDetail"
            },
            {
                $group: {
                    _id: null,
                    ingredientUsed_list: {
                        $push: {
                            cakeID: "$cakes.cake_id",
                            cakeQuantity: "$cakes.cakeQuantity",
                            recipeID: "$recipeDetail.recipeID",
                            ingredID:
                                "$recipeDetail.ingredients.ingredID",
                            ingredQuantity:
                                "$recipeDetail.ingredients.ingredQuantity"
                        }
                    }
                }
            },
            { $unwind: "$ingredientUsed_list" },
            {
                $addFields: {
                    total_ingred_used: {
                        $multiply: [
                            {
                                $toInt:
                                    "$ingredientUsed_list.cakeQuantity"
                            },
                            {
                                $toInt:
                                    "$ingredientUsed_list.ingredQuantity"
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$ingredientUsed_list.ingredID",
                    ingredID: { $first: "$ingredientUsed_list.ingredID" },
                    totalUsedQuantity: { $sum: "$total_ingred_used" }
                }
            },
            {
                $lookup: {
                    from: "ingredients",
                    localField: "ingredID",
                    foreignField: "ingredientID",
                    as: "ingredientDetail"
                }
            },
            { $unwind: "$ingredientDetail" },
            {
                $project: {
                    _id: 1,
                    ingredID: "$ingredID",
                    totalUsedQuantity: "$totalUsedQuantity",
                    ingredientQuantity: "$ingredientDetail.ingredientQuantity",
                    remainingQuantity: {
                        $subtract: [
                            "$ingredientDetail.ingredientQuantity",
                            "$totalUsedQuantity"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    remaining_ingred_list: {
                        $push: {
                            ingredID: "$ingredID",
                            remainingQuantity: "$remainingQuantity"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    remaining_ingred_list: 1
                }
            }
        ]);

        if (remaining_ingred_list.length === 0) {
            return res.status(200).json({
                status: 'SUCCESS',
                message: 'No ingredients found for the given order'
            });
        }

        return res.status(200).json({
            status: 'SUCCESS',
            data: remaining_ingred_list
        });
    }
    catch (error) {
        return res.status(404).json({
            status: 'ERROR',
            message: error.message
        });
    };
}

export default ingredientController;