import * as FeatureRepository from '../repositories/feature.repository';
import HttpException from '../helpers/httpException';
import { IFeature } from '../types/feature.types';
import { ParsedQuery } from '../helpers/queryParser';
import { MstFeatureRecord } from '../types/table/mstFeatures';

export async function listFeatures(pq: ParsedQuery): Promise<MstFeatureRecord[]> {
    return await FeatureRepository.getAllFeatures(pq.filters, pq.sortBy, pq.order, pq.limit, pq.offset);
}

export const createFeature = async (feature: string) => {
    const existing = await FeatureRepository.findFeatureByName(feature);
    if (existing.length) throw new HttpException(400, 'Fitur sudah ada')

    return await FeatureRepository.createFeature(feature);
}

export const deleteFeature = async (id: number) => {
    const existing = await FeatureRepository.findFeatureById(id);
    if (!existing) throw new HttpException(400, 'Fitur tidak ditemukan')

    await FeatureRepository.deleteFeatureById(id);
    return existing as IFeature;
}