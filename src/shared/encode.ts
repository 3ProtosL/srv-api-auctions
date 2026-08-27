// src/shared/utils/pagination-cursor.util.ts
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const decodeCursor = (cursor: string): [any, string] => {
    try {
        const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8');
        const parsed = JSON.parse(jsonStr);

        // Validar que sea un arreglo de 2 elementos [sortValue, id]
        if (!Array.isArray(parsed) || parsed.length !== 2) {
            throw new Error('Estructura de cursor inválida');
        }

        const [customValue, id] = parsed;

        // Si tu base de datos usa ObjectIds de MongoDB, validamos su formato
        if (id && !Types.ObjectId.isValid(id)) {
            throw new Error('El ID contenido en el cursor no es un ObjectId válido');
        }

        return [customValue, id];
    } catch (error) {
        // Al lanzar BadRequestException, NestJS responde un 400 limpio al cliente
        throw new BadRequestException('El cursor proporcionado es inválido o está corrupto');
    }
};

export const encodeCursor = (customValue: any, id: string): string => {
    const jsonStr = JSON.stringify([customValue, id]);
    return Buffer.from(jsonStr).toString('base64');
};