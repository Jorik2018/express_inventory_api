import { PrismaClient, Movement, Inventary, Details_movement } from '@prisma/client'
import express, { Request, Response } from 'express';
import { validateToken } from '../auth';
import axios, { AxiosError } from 'axios';
import fs, { createWriteStream } from 'fs';
import fsSync from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import moment from 'moment';

const prisma = new PrismaClient()
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send("Inventory API")
    return;
});

function getMonth(date: any) {
    let res = moment(date).format("MM");
    let num = Number(res);
    switch (num) {
        case 1:
            res = "ENERO";
            break;
        case 2:
            res = "FEBRERO";
            break;
        case 3:
            res = "MARZO";
            break;
        case 4:
            res = "ABRIL";
            break;
        case 5:
            res = "MAYO";
            break;
        case 6:
            res = "JUNIO";
            break;
        case 7:
            res = "JULIO";
            break;
        case 8:
            res = "AGOSTO";
            break;
        case 9:
            res = "SETIEMBRE";
            break;
        case 10:
            res = "OCTUBRE";
            break;
        case 11:
            res = "NOVIEMBRE";
            break;
        case 12:
            res = "DICIEMBRE";
            break;
    }
    return res;
}

router.get('/report', async (req: Request, res: Response) => {
    try {
        let type = req.query.type;
        let id = req.query.id
        let data
        let aux: object[] = [];
        let newData: object[] = []
        let template = ""
        switch (type) {
            case "in":
                template = "ficha_entrada"
                data = await prisma.movement.findMany({
                    include: {
                        details: {
                            include: {
                                inventary: true
                            }
                        },
                    },
                    where: {
                        type: {
                            contains: "I"
                        },
                        id: {
                            equals: Number(id)
                        }
                    }
                })
                data.map(x => {
                    x.details.map((y:any) => {
                        aux.push({
                            "canceled": y.inventary.is_delete,
                            "codePatrimonial": y.inventary.patrimonial_code,
                            "color": y.inventary.color,
                            "condition": y.inventary.conservation_state,
                            "denomination": y.inventary.denomination,
                            "dimention": y.inventary.dimensions,
                            "id": y.inventary.id,
                            "marca": y.inventary.brand,
                            "model": y.inventary.model,
                            "moveId": y.movement_id,
                            "num_lote": y.inventary.lot,
                            "observation": y.inventary.observations,
                            "others": y.inventary.others,
                            "series": y.inventary.serie
                        })
                    })
                    newData.push({
                        "adress": x.address,
                        "adress_destino": x.address_destiny,
                        "canceled": x.is_delete,
                        "company": "company",
                        "createDate": moment(x.created_at).format('YYYY/MM/DD'),
                        "date": moment(x.created_at).format('YYYY/MM/DD'),
                        "deleteDate": x.updated_at,
                        "dependence": x.unit_organic,
                        "dependence_id": "id_dependence",
                        "details": aux,
                        "dni": x.responsible_user_document,
                        "dni_destino": x.destiny_user_document,
                        "document_authorization": x.auth_document,
                        "email": x.responsible_user_email,
                        "email_destino": x.destiny_user_email,
                        "fullName": x.responsible_user_name,
                        "fullName_destino": x.destiny_user_name,
                        "id": x.id,
                        "local_destino": x.local,
                        "proveedor_destino": x.local_destiny,
                        "reason": x.reason,
                        "reference": "reference",
                        "register_code": x.register_code,
                        "type": x.type,
                        "uid": x.user_id
                    })
                })
                break;
            case "out":
                template = "ficha_salida"
                data = await prisma.movement.findMany({
                    include: {
                        details: {
                            include: {
                                inventary: true
                            }
                        },
                    },
                    where: {
                        type: {
                            not: "I"
                        },
                        id: {
                            equals: Number(id)
                        }
                    }
                })
                data.map((x:any) => {
                    x.details.map((y:any) => {
                        aux.push({
                            "canceled": y.inventary.is_delete,
                            "codePatrimonial": y.inventary.patrimonial_code,
                            "color": y.inventary.color,
                            "condition": y.inventary.conservation_state,
                            "denomination": y.inventary.denomination,
                            "dimention": y.inventary.dimensions,
                            "id": y.inventary.id,
                            "marca": y.inventary.brand,
                            "model": y.inventary.model,
                            "moveId": y.movement_id,
                            "num_lote": y.inventary.lot,
                            "observation": y.inventary.observations,
                            "others": y.inventary.others,
                            "series": y.inventary.serie
                        })
                    })
                    newData.push({
                        "adress": x.address,
                        "adress_destino": x.address_destiny,
                        "canceled": x.is_delete,
                        "company": "company",
                        "createDate": moment(x.created_at).format('YYYY/MM/DD'),
                        "date": moment(x.date).format('YYYY/MM/DD'),
                        "deleteDate": x.updated_at,
                        "dependence": x.unit_organic,
                        "dependence_destino": x.unit_organic_destiny,
                        "dependence_id": "id_dependence",
                        "details": aux,
                        "dni": x.responsible_user_document,
                        "dni_destino": x.destiny_user_document,
                        "document_authorization": x.auth_document,
                        "email": x.responsible_user_email,
                        "email_destino": x.destiny_user_email,
                        "unid_ejec": "GOBIERNO REGIONAL DE ANCASH",
                        "mes": getMonth(x.date),
                        "fullName": x.responsible_user_name,
                        "user_entrega": x.responsible_user_name,
                        "user_destino": x.destiny_user_name,
                        "fullName_destino": x.destiny_user_name,
                        "id": x.id,
                        "local_destino": x.local,
                        "proveedor_destino": x.local_destiny,
                        "reason": x.reason === "M" ? "MANTENIMIENTO" : x.reason === "CO" ? "COMISIÓN DE SERVICIOS" : "CAPACITACIÓN Y/O EVENTO",
                        "reference": "reference",
                        "register_code": x.register_code,
                        "type": x.type === "S" ? "SALIDA" : x.type === "R" ? "REINGRESO" : "DESPLAZAMIENTO",
                        "uid": x.user_id
                    })
                })
                break;
            case "inventary":
                template = "ficha_bienes"
                data = await prisma.inventary.findMany()
                data.map((x:any) => {
                    newData.push({
                        "codePatrimonial": x.patrimonial_code,
                        "denomination": x.denomination,
                        "num_lote": x.lot,
                        "marca": x.brand,
                        "model": x.model,
                        "color": x.color,
                        "dimensions": x.dimensions,
                        "series": x.serie,
                        "others": x.others,
                        "condition": x.conservation_state,
                        "moveId": x.id.toString()
                    })
                })
                console.log(newData)
                break;
            default:
                break;
        }
        let uniqueId = uuidv4()
        fs.writeFileSync('./temp/json/' + uniqueId + '.json', JSON.stringify(newData), 'utf8');
        const file = await fsSync.readFile('./temp/json/' + uniqueId + '.json');
        const form = new FormData();
        form.append('template', template);
        form.append('filename', uniqueId + ".json")
        form.append('extension', 'pdf')
        form.append('file', file, uniqueId + ".json")
        let response
        try {
            response = await axios.post('http://web.regionancash.gob.pe/api/jreport/', form, {
                headers: {
                    ...form.getHeaders(),
                },
                responseType: 'arraybuffer'
            })
            fs.writeFile('./temp/pdf/' + uniqueId + '.pdf', response.data, { encoding: null }, (err) => {
                if (err) {
                    console.log("Error to create a .pdf file")
                } else {
                    console.log("Success to create a .pdf file")
                    fs.unlinkSync('./temp/json/' + uniqueId + '.json')
                    let data = fs.readFileSync('./temp/pdf/' + uniqueId + ".pdf");
                    res.contentType("application/pdf");
                    fs.unlinkSync('./temp/pdf/' + uniqueId + '.pdf')
                    res.send(data);
                }
            });
        } catch (error) {
            console.log(error)
            response = null
            res.status(400).send("Error in the generation of report in the Java Endpoint")
        }
    } catch (error) {
        console.log(error)
        res.status(400).send("Error in the generation of report")
    }
    return;
});

router.get('/inventory/:id', validateToken, async (req: Request, res: Response) => {
    try {
        let patrimonial_code: string = req.params.id;
        let response = await prisma.inventary.findFirst({
            where: {
                patrimonial_code: patrimonial_code
            }
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(502).send(error)
    }
    return;
});

router.get('/movement/:start/:end', validateToken, async (req: Request, res: Response) => {
    try {
        let start: number = Number(req.params.start);
        let end: number = Number(req.params.end);
        let type: string = req.query.type ? req.query.type as string : "";
        let register_code: string = req.query.register_code ? req.query.register_code as string : "";
        let responsible_user: string = req.query.responsible_user ? req.query.responsible_user as string : "";
        let destiny_user: string = req.query.destiny_user ? req.query.destiny_user as string : "";
        let unit_organic: string = req.query.unit_organic ? req.query.unit_organic as string : "";
        let local: string = req.query.local ? req.query.local as string : "";
        let unit_organic_destiny: string = req.query.unit_organic_destiny ? req.query.unit_organic_destiny as string : "";
        let local_destiny: string = req.query.local_destiny ? req.query.local_destiny as string : "";
        let date: string | Date = req.query.date ? req.query.date as string : "";
        let response = await prisma.movement.findMany({
            where: {
                type: type === "" ? {
                    not: "I"
                } : {
                    contains: type
                },
                register_code: {
                    contains: register_code
                },
                responsible_user_name: {
                    contains: responsible_user
                },
                destiny_user_name: {
                    contains: destiny_user
                },
                unit_organic: {
                    contains: unit_organic
                },
                unit_organic_destiny: unit_organic_destiny !== "" ? {
                    contains: unit_organic_destiny
                } : {},
                local: {
                    contains: local
                },
                local_destiny: local_destiny !== "" ? {
                    contains: local_destiny
                } : {},
                date: date !== "" ? { equals: date } : {}
            },
            skip: start,
            take: end
        })
        let count = await prisma.movement.count({
            where: {
                type: type === "" ? {
                    not: "I"
                } : {
                    contains: type
                },
                register_code: {
                    contains: register_code
                },
                responsible_user_name: {
                    contains: responsible_user
                },
                destiny_user_name: {
                    contains: destiny_user
                },
                unit_organic: {
                    contains: unit_organic
                },
                unit_organic_destiny: unit_organic_destiny !== "" ? {
                    contains: unit_organic_destiny
                } : {},
                local: {
                    contains: local
                },
                local_destiny: local_destiny !== "" ? {
                    contains: local_destiny
                } : {},
                date: date !== "" ? { equals: date } : {}
            }
        });
        res.status(200).json({
            data: response,
            count: count
        });
    } catch (error) {
        res.status(502).send(error)
    }
    return;
});

router.get('/dashboard', validateToken, async (req: Request, res: Response) => {
    try {
        let ins = await prisma.movement.count({
            where: {
                type: {
                    contains: "I"
                }
            }
        })
        let outs = await prisma.movement.count({
            where: {
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
    } catch (error) {
        res.status(502).send(error)
    }
    return;
});

router.get('/inventory/:start/:end', validateToken, async (req: Request, res: Response) => {
    try {
        let start: number = Number(req.params.start);
        let end: number = Number(req.params.end);
        let where:any={};
        ['patrimonial_code','denomination','brand','model','color','serie','lot',
            'others','conservation_state','observations'].forEach((k)=>{
            if(req.query[k])where[k]={contains:req.query[k]};
        });

        let response = await prisma.inventary.findMany({
            skip: start,
            take: end,
            include: {
                details_movements: {
                    orderBy: {
                        id: 'desc'
                    },
                    take: 1,
                    include: {
                        movement: true
                    }
                }
            },
            where:where
        })
        let count = await prisma.inventary.count({
            where:where
        })
        res.status(200).json({
            where:where,
            data: response.map((x:any) => {
                return {
                    "id": x.id,
                    "patrimonial_code": x.patrimonial_code,
                    "denomination": x.denomination,
                    "lot": x.lot,
                    "brand": x.brand,
                    "model": x.model,
                    "color": x.color,
                    "dimensions": x.dimensions,
                    "serie": x.serie,
                    "others": x.others,
                    "conservation_state": x.conservation_state,
                    "user_id": x.user_id,
                    "observations": x.observations,
                    "created_at": x.created_at,
                    "updated_at": x.updated_at,
                    "is_delete": x.is_delete,
                    "unit_organic": x['details_movements'][0]['movement']['unit_organic_destiny'],
                    "local": x['details_movements'][0]['movement']['local_destiny'],
                    "responsible_document": x['details_movements'][0]['movement']['destiny_user_document'],
                    "responsible_name": x['details_movements'][0]['movement']['destiny_user_name']
                }
            }),
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(502).send(error)
    }
    return;
});

router.get('/movement/:id', async (req: Request, res: Response) => {
    try {
        let id: number = Number(req.params.id);
        let response = await prisma.movement.findUnique({
            include: {
                details: {
                    include: {
                        inventary: true
                    }
                }
            },
            where: {
                id: id
            }
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send("Error to get data")
    }
    return;
});

router.post('/token', async (req: Request, res: Response) => {
    let code: string = req.body.code;
    let user: string = process.env.CLIENT_ID_OAUTH || '';
    let password: string = process.env.CLIENT_SECRET_OAUTH || '';
    console.log(code)
    console.log(user)
    console.log(password)
    let response
    try {
        response = await axios({
            url: process.env.OAUTH_URL + '/token',
            method: 'post',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`
            },
            data: 'grant_type=authorization_code&scope=profile&code=' + code
        })
        res.status(200).send(response.data);
    } catch (error: any) {
        res.status(400).send(error.response.data)
    }
    return;
});

router.post('/movement', validateToken, async (req: Request, res: Response) => {
    try {
        let data: Movement = req.body;
        data.unit_organic_destiny = data.unit_organic_destiny === undefined ? data.unit_organic : data.unit_organic_destiny
        data.local_destiny = data.local_destiny === undefined ? data.local : data.local_destiny
        data.address_destiny = data.address_destiny === undefined ? data.address : data.address_destiny
        data.user_id = req.body.user_id
        let response = await prisma.movement.create({
            data: {
                address: data.address,
                address_destiny: data.address_destiny,
                auth_document: data.auth_document,
                date: data.date,
                destiny_user_email: data.destiny_user_email,
                destiny_user_name: data.destiny_user_name,
                destiny_user_document: data.destiny_user_document,
                local: data.local,
                local_destiny: data.local_destiny,
                reason: data.reason,
                responsible_user_email: data.responsible_user_email,
                responsible_user_name: data.responsible_user_name,
                responsible_user_document: data.responsible_user_document,
                register_code: data.register_code,
                type: data.type,
                unit_organic: data.unit_organic,
                unit_organic_destiny: data.unit_organic_destiny,
                user_id: data.user_id,
            }
        });
        res.status(200).send(response)
    } catch (error) {
        res.status(502).send(error)
    }
    return;
});

router.post('/details/in', validateToken, async (req: Request, res: Response) => {
    try {
        let data: Inventary = req.body.data;
        data.user_id = req.body.user_id
        data.patrimonial_code = data.patrimonial_code === "" ? "S/C" : data.patrimonial_code;
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
            include: {
                inventary: true
            }
        })
        res.status(200).json(response2)
    } catch (error) {
        res.status(502).send(error)
    }
    return;
});

router.post('/details/traslate', validateToken, async (req: Request, res: Response) => {
    try {
        let data: Details_movement = req.body;
        let response = await prisma.details_movement.create({
            data: {
                movement_id: data.movement_id,
                inventary_id: data.inventary_id,
                user_id: req.body.user_id
            }
        });
        res.status(200).json(response)
    } catch (error) {
        res.status(502).send(error)
    }
    return;
});

export {
    router
}