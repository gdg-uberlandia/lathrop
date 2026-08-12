import { Timestamp } from "firebase-admin/firestore";
import {
  Company,
  CompanyInput,
  companyFieldsSchema,
  companyInputSchema,
} from "@/contracts/company";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { isCompanyReferenced } from "@/lib/companies/references";

const COMPANIES_COLLECTION = getFirestoreCollectionName("companies");
const MISSIONS_COLLECTION = getFirestoreCollectionName("missions");

function parseCompany(id: string, value: FirebaseFirestore.DocumentData) {
  return companyFieldsSchema.parse({
    ...value,
    id,
    createdAt:
      value.createdAt instanceof Timestamp
        ? value.createdAt.toDate()
        : value.createdAt,
    updatedAt:
      value.updatedAt instanceof Timestamp
        ? value.updatedAt.toDate()
        : value.updatedAt,
  });
}

export async function getAllCompanies(): Promise<Company[]> {
  const snapshot = await db
    .collection(COMPANIES_COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .map((doc) => parseCompany(doc.id, doc.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getCompanyById(companyId: string): Promise<Company> {
  const document = await db
    .collection(COMPANIES_COLLECTION)
    .doc(companyId)
    .get();
  if (!document.exists)
    throw new Error(`Empresa com id ${companyId} não encontrada.`);
  const company = parseCompany(document.id, document.data()!);
  if (company.eventId !== CURRENT_EVENT_ID)
    throw new Error(`Empresa com id ${companyId} não encontrada.`);
  return company;
}

export async function createCompany(input: CompanyInput): Promise<Company> {
  const data = companyInputSchema.parse(input);
  const reference = db.collection(COMPANIES_COLLECTION).doc(data.id);
  if ((await reference.get()).exists)
    throw new Error(`Empresa com id ${data.id} já existe.`);
  const now = new Date();
  const company = companyFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  });
  await reference.create(company);
  return company;
}

export async function updateCompany(input: CompanyInput): Promise<Company> {
  const data = companyInputSchema.parse(input);
  const current = await getCompanyById(data.id);
  const company = companyFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: current.createdAt,
    updatedAt: new Date(),
  });
  await db.collection(COMPANIES_COLLECTION).doc(data.id).set(company);
  return company;
}

export async function deleteCompany(companyId: string): Promise<string> {
  await getCompanyById(companyId);
  const missions = await db
    .collection(MISSIONS_COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  const used = isCompanyReferenced(
    missions.docs.map((doc) => doc.data()),
    companyId,
  );
  if (used)
    throw new Error(
      "Esta empresa é pré-requisito de uma missão e não pode ser excluída.",
    );
  await db.collection(COMPANIES_COLLECTION).doc(companyId).delete();
  return companyId;
}
