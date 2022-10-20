import { PrismaClient, Movement, Inventary, Details_movement,User } from '@prisma/client'
import express, {Request, Response} from 'express';
import { validateToken } from '../auth';
import axios, { AxiosError } from 'axios';

const prisma = new PrismaClient()
const router = express.Router();

router.get('/', (req: Request, res: Response)=>{
    res.status(200).send("Inventary API")
});

router.get('/inventary/:id', validateToken, async (req: Request, res: Response)=>{
    let patrimonial_code: string = req.params.id;
    let response = await prisma.inventary.findFirst({
        where: {
            patrimonial_code: patrimonial_code
        }
    })
    res.status(200).json(response);
});

router.get('/movement/:start/:end', validateToken, async (req: Request, res: Response)=>{
    let start: number = Number(req.params.start);
    let end: number = Number(req.params.end);
    let type: string = req.query.type?req.query.type as string: "";
    let register_code: string = req.query.register_code?req.query.register_code as string: "";
    let responsible_user: string = req.query.responsible_user?req.query.responsible_user as string: "";
    let destiny_user: string = req.query.destiny_user?req.query.destiny_user as string: "";
    let unit_organic: string = req.query.unit_organic?req.query.unit_organic as string: "";
    let local: string = req.query.local?req.query.local as string: "";
    let unit_organic_destiny: string = req.query.unit_organic_destiny?req.query.unit_organic_destiny as string: "";
    let local_destiny: string = req.query.local_destiny?req.query.local_destiny as string: "";
    let date: string | Date = req.query.date?req.query.date as string: "";
    let response = await prisma.movement.findMany({
        include: {
            destiny_user: true,
            responsible_user: true,
        },
        where:{
            type: type===""?{
                not: "I"
            }:{
                contains: type
            },
            register_code: {
                contains: register_code
            },
            responsible_user: {
                fullname: {
                    contains: responsible_user
                }
            },
            destiny_user: {
                fullname:{
                    contains: destiny_user
                }
            },
            unit_organic: {
                contains: unit_organic
            },
            unit_organic_destiny:unit_organic_destiny!==""?{
                contains: unit_organic_destiny
            }:{},
            local: {
                contains: local
            },
            local_destiny: local_destiny!==""?{
                contains: local_destiny
            }:{},
            date: date!==""?{equals: date}:{}
        },
        skip: start,
        take: end
    })
    res.status(200).json(response);
});

router.get('/dashboard', validateToken, async (req: Request, res: Response)=>{
    let ins = await prisma.movement.count({
        where:{
            type: {
                contains: "I"
            }
        }
    })
    let outs = await prisma.movement.count({
        where:{
            type: {
                not: "I"
            }
        }
    })
    let inventary = await prisma.inventary.count();
    res.status(200).json({
        ins: ins,
        outs: outs,
        inventary: inventary
    })
});

router.get('/inventary/:start/:end', validateToken, async (req: Request, res: Response)=>{
    let start: number = Number(req.params.start);
    let end: number = Number(req.params.end);
    let patrimonial_code: string = req.query.patrimonial_code?req.query.patrimonial_code as string:"";
    let denomination: string = req.query.denomination?req.query.denomination as string:"";
    let brand: string = req.query.brand?req.query.brand as string:"";
    let model: string = req.query.model?req.query.model as string:"";
    let color: string = req.query.color?req.query.color as string:"";
    let serie: string = req.query.serie?req.query.serie as string:"";
    let lot: string = req.query.lot?req.query.lot as string:"";
    let others: string = req.query.others?req.query.others as string:"";
    let conservation_state: string = req.query.conservation_state?req.query.conservation_state as string:"";
    let observations: string = req.query.observations?req.query.observations as string:"";
    let response = await prisma.inventary.findMany({
        skip: start,
        take: end,
        where:{
            patrimonial_code:{
                contains: patrimonial_code
            },
            denomination:{
                contains: denomination
            },
            brand: {
                contains: brand
            },
            model:{
                contains: model
            },
            color: {
                contains:color
            },
            serie: {
                contains: serie
            },
            lot: {
                contains: lot
            },
            others: {
                contains: others
            },
            conservation_state: {
                contains: conservation_state
            },
            observations: {
                contains: observations
            }
        }
    })
    res.status(200).json(response);
});

router.get('/user/:document', validateToken, async (req: Request, res: Response)=>{
    let document: string = req.params.document;
    let response = await prisma.user.findFirst({
        where: {
            document: document
        }
    })
    if(response===null){
        res.status(400).send();
    } else {
        res.status(200).json(response);
    }
});

router.get('/movement/:id', validateToken, async (req: Request, res: Response)=>{
    let id: number = Number(req.params.id);
    let response = await prisma.movement.findUnique({
        include: {
            destiny_user: true,
            responsible_user: true,
            details: {
                include:{
                    inventary: true
                }
            }
        },
        where: {
            id: id
        }
    })
    res.status(200).json(response);
});

router.post('/token', async (req: Request, res: Response)=>{
    let code: string = req.body.code;
    let user: string = process.env.CLIENT_ID_OAUTH || '';
    let password: string = process.env.CLIENT_SECRET_OAUTH || '';
    console.log(code)
    console.log(user)
    console.log(password)
    let response
    try {
        response = await axios({
            url: process.env.OAUTH_URL+'/token',
            method: 'post',
            headers: {
                'Authorization':  `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
            },
            data: 'grant_type=authorization_code&scope=profile&code='+code
        })
        res.status(200).send(response.data);
    } catch (error: any) {
        res.status(400).send(error.response.data)
    }
});

router.post('/movement', validateToken, async (req: Request, res: Response)=>{
    let data: Movement = req.body;
    data.user_id = req.body.user_id
    let response = await prisma.movement.create({
        data: {
            address: data.address,
            address_destiny: data.address_destiny,
            auth_document: data.auth_document,
            date: data.date,
            destiny_user: {
                connect:{
                    id: data.destiny_user_id
                }
            },
            local: data.local,
            local_destiny: data.local_destiny,
            reason: data.reason,
            responsible_user: {
                connect:{
                    id: data.responsible_user_id
                }
            },
            register_code: data.register_code,
            type: data.type,
            unit_organic: data.unit_organic,
            unit_organic_destiny: data.unit_organic_destiny,
            user_id: data.user_id,
        }
    }); 
    res.status(200).send(response)
});

router.post('/user', validateToken, async (req: Request, res: Response)=>{
    let data: User = req.body;
    data.user_id = req.body.user_id
    let response = await prisma.user.create({
        data: data
    })
    res.status(200).send(response)
});

router.post('/details/in', validateToken, async (req: Request, res: Response)=>{
    let data: Inventary = req.body.data;
    data.user_id = req.body.user_id
    data.patrimonial_code = data.patrimonial_code===""?"S/C":data.patrimonial_code;
    let id: number = Number(req.body.id)
    let response = await prisma.inventary.create({
        data: data,
    });
    let response2 = await prisma.details_movement.create({
        data: {
            movement_id: id,
            inventary_id: response.id,
            user_id: req.body.user_id
        },
        include:{
            inventary: true
        }
    })
    res.status(200).json(response2)
});

router.post('/details/traslate', validateToken, async (req: Request, res: Response)=>{
    let data: Details_movement = req.body;
    console.log(data)
    let response = await prisma.details_movement.create({
        data: {
            movement_id: data.movement_id,
            inventary_id: data.inventary_id,
            user_id: req.body.user_id
        }
    });
    res.status(200).json(response)
});

export {
    router
}