import { getAllHotels as get, getByHotelId as getbyid} from "@/services/hotels-service";
import { AuthenticatedRequest } from '@/middlewares';
import { NextFunction, Response } from 'express';
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  
    try {
      if(!req.userId){
        //se der erro
      }
      const hotels = await get(req.userId);
      return res.status(httpStatus.OK).send(hotels);
    } catch (e) {
      next(e);
    }
  }

export async function getByHotelId(req: AuthenticatedRequest, res: Response, next: NextFunction) {  
    try {
        const { userId } = req;
    const { hotelId } = req.params;
    if(!userId || !hotelId){
        //se der erro
    }
    const numerico = parseInt(hotelId);
      const hotels = await getbyid(userId, numerico);
  
      return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
      next(error);
    }
  }