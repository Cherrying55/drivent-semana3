import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getAllHotelsonDB() {
    return prisma.hotel.findMany();
  }

export async function getByHotelIdonDB(id: number) {
    const todas =  prisma.hotel.findFirst({
      where: {
        id
      },
      include: {
        Rooms: true,
      },
    });
    return todas;
  }

export async function checagem(idUser: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(idUser);
    if (!enrollment) throw notFoundError()
    else{
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  
    if (!ticket ||ticket.TicketType.isRemote || ticket.status === 'RESERVED')
      throw notFoundError();
    
}
  }
export async function getAllHotels(idUser: number) {
    await checagem(idUser);
  
    const hotels = await getAllHotelsonDB();
    if (!hotels || hotels.length === 0)
      throw notFoundError();
    else return hotels;
  }

 export async function getByHotelId(idUser: number, idHotel: number) {
    await checagem(idUser);
  
    const hotel = await getByHotelIdonDB(idHotel);
  
    if (!hotel || hotel.Rooms.length === 0) {
      throw notFoundError();
    }
    else{
    return hotel;
    }
  }