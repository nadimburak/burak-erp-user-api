import express from "express";

import { authenticate } from "../middlewares/auth";
import AllergiesRoutes from "./allergies";
import CustomerApplyAppointmentsRoutes from "./applyAppointment";
import CustomerAppointmentsRoutes from "./appointments";
import CustomerAppointmentTypesRoutes from "./appointmentTypes";
import authRoutes from "./auth";
import CompanyRoutes from "./company/companies";
import CompanyServiceRoutes from "./company/companyServices";
import CompanyUserRoutes from "./company/companyUsers";
import CustomerAllergiesRoutes from "./customerAllergies";
import CustomerBanksRoutes from "./customerBanks";
import CustomerDocumentsRoutes from "./customerDocuments";
import CustomerLanguagesRoutes from "./customerLanguages";
import CustomerMedicalConditionsRoutes from "./customerMedicalConditions";
import CustomerMedicalCoversRoutes from "./customerMedicalCovers";
import CustomerVaccinationsRoutes from "./customerVaccinations";
import CustomerInvoiceRoutes from "./invoices";
import LanguagesRoutes from "./languages";
import MedicalConditionsRoutes from "./medicalConditions";
import MedicalCoverTypesRoutes from "./medicalCoverTypes";
import CustomerPrescriptionsRoutes from "./prescriptions";
import CustomerReportDocumentRoutes from "./reportDocuments";
import CustomerVacanciesRoutes from "./vacancies";
import CustomerVacancyApplicationRoutes from "./vacancyApply";
import CustomerVacancyApplyStatusRoutes from "./vacancyApplyStatus";
import VaccinationsRoutes from "./vaccinations";

const customerRouter = express.Router();

// Combine routes
customerRouter.use("/auth", [authRoutes]);

customerRouter.use(authenticate);

customerRouter.use([
  MedicalCoverTypesRoutes,
  VaccinationsRoutes,
  MedicalConditionsRoutes,
  AllergiesRoutes,
  LanguagesRoutes,
  CustomerBanksRoutes,
  CustomerLanguagesRoutes,
  CustomerDocumentsRoutes,
  CustomerAllergiesRoutes,
  CustomerVaccinationsRoutes,
  CustomerMedicalCoversRoutes,
  CustomerMedicalConditionsRoutes,
  CustomerAppointmentsRoutes,
  CustomerApplyAppointmentsRoutes,
  CustomerAppointmentTypesRoutes,
  CustomerPrescriptionsRoutes,
  CustomerInvoiceRoutes,
  CustomerReportDocumentRoutes,
  CustomerVacanciesRoutes,
  CustomerVacancyApplicationRoutes,
  CustomerVacancyApplyStatusRoutes,
]);

customerRouter.use("/company", [
  CompanyRoutes,
  CompanyUserRoutes,
  CompanyServiceRoutes,
]);

export default customerRouter;
