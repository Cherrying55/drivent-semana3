import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { Hotel, Room, Ticket, TicketType } from '@prisma/client';
import {
    createEnrollmentWithAddress,
    createUser,
    createTicketType,
    createTicket,
    createPayment,
    generateCreditCardData,
    ticketremoto,
  } from '../factories';



export async function createHotel() {
    return await prisma.hotel.create({
      data: {
        name: faker.name.findName(),
        image: faker.image.imageUrl()
      },
    });
  }

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });

  const server = supertest(app);

  describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('ticket remoto, garantia ', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const remoto = await ticketremoto();
        const ticket = await createTicket(enrollment.id, remoto.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, remoto.price);
        const token = await generateValidToken(user);
        
        
  
        let res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(res.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('usuario sem um enrollment ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('lista de hoteis, tudo certo', async () => {
        const ticketType = await ticketremoto();
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const createdHotel = await createHotel();
  
        const res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(res.status).toEqual(httpStatus.OK);
  
        expect(res.body).toEqual([
          {
            id: createdHotel.id,
            name: createdHotel.name,
            image: createdHotel.image,
            createdAt: createdHotel.createdAt.toISOString(),
            updatedAt: createdHotel.updatedAt.toISOString(),
          },
        ]);
      });
    });
  });

  



  describe('GET /hotels/:hotelId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels/1');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("when token is valid", () => {

        it('ticket remoto, garantia ', async () => {
            const user = await createUser();
            const enrollment = await createEnrollmentWithAddress(user);
            const remoto = await ticketremoto();
            const ticket = await createTicket(enrollment.id, remoto.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, remoto.price);
            const token = await generateValidToken(user);
            
            
      
            let res = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(res.status).toEqual(httpStatus.NOT_FOUND);
          });

          it('usuario sem um enrollment ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
          });
        
          //fazer o status 200

          

      })
  })