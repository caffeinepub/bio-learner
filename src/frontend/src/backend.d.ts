import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Photo {
    id: bigint;
    title: string;
    image: ExternalBlob;
}
export type Time = bigint;
export interface StudyMaterial {
    id: bigint;
    title: string;
    subject: string;
    file: ExternalBlob;
    description: string;
}
export interface Notice {
    id: bigint;
    title: string;
    content: string;
    date: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNotice(title: string, content: string): Promise<void>;
    deleteNotice(id: bigint): Promise<void>;
    deletePhoto(id: bigint): Promise<void>;
    deleteStudyMaterial(id: bigint): Promise<void>;
    getAllNotices(): Promise<Array<Notice>>;
    getAllPhotos(): Promise<Array<Photo>>;
    getAllStudyMaterials(): Promise<Array<StudyMaterial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNotice(id: bigint): Promise<Notice | null>;
    getPhoto(id: bigint): Promise<Photo | null>;
    getStudyMaterial(id: bigint): Promise<StudyMaterial | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadPhoto(title: string, image: ExternalBlob): Promise<void>;
    uploadStudyMaterial(title: string, description: string, subject: string, file: ExternalBlob): Promise<void>;
}
