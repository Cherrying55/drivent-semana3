import { getAllHotels, getByHotelId } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelrouter = Router();

hotelrouter.get("/hotels", authenticateToken, getAllHotels)
hotelrouter.get("/hotels/:hotelId", authenticateToken, getByHotelId)

export default hotelrouter;