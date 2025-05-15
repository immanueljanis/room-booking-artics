import { Request, Response, NextFunction, RequestHandler } from "express";
import * as FeatureServices from '../services/feature.service'
import { sendSuccess } from "../helpers/responseHandler";
import { IFeature } from "../types/feature.types";
import { parseQueryParams } from "../helpers/queryParser";

const QUERY_OPTS: any = {
    defaultLimit: 10,
    defaultSortBy: "created_at",
    defaultOrder: "DESC" as const,
    sortableFields: {
        nama: "name",
        active: "active",
        created_at: "created_at",
        updated_at: "updated_at",
    },
    filterableFields: {
        active: "active",
        name: "name",
    },
    filterOperators: {
        active: "=",
        name: "LIKE",
    },
};

export const getFeatures: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pq = parseQueryParams(req.query, QUERY_OPTS);
        const features = await FeatureServices.listFeatures(pq);
        sendSuccess(res, 200, "Get all features success", features);
    } catch (err) {
        next(err);
    }
};

export const createFeature = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name }: { name: string } = req.body
        await FeatureServices.createFeature(name)

        sendSuccess(res, 201, 'Fitur berhasil didaftarkan', { name })
    } catch (error) {
        next(error)
    }
}

export const deleteFeature = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const action: IFeature = await FeatureServices.deleteFeature(Number(id));

        sendSuccess(res, 200, 'Fitur berhasil dihapus', { name: action.name })
    } catch (error) {
        next(error)
    }
}