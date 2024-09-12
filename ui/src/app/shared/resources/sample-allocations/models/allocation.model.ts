import { orderBy, groupBy } from "lodash";
import { ConceptGet } from "../../openmrs";

export interface AlloCationStatusObject {
  uuid?: string;
  category?: string;
  remarks?: string;
  status: string;
  user: any;
  result?: any;
  timestamp: Number;
}

export interface ResultObject {
  uuid?: string;
  valueBoolean: boolean;
  testAllocation: any;
  valueText: string;
  valueModifier: null;
  creator: any;
  valueNumeric: number;
  valueCoded: any;
  concept: ConceptGet;
  urgentTAT: string;
  instrument: ConceptGet;
  resultGroup: ResultObject;
  valueGroupId: number;
  abnormal: boolean;
  dateCreated: number;
  standardTAT: number;
  additionalReqTimeLimit: number;
  valueDateTime: number;
  valueComplex: any;
  value?: any;
  status?: any;
  groups?: any[];
}

export interface SampleAllocationObject {
  id?: string;
  container: ConceptGet;
  isSet: boolean;
  parameter: any;
  statuses: AlloCationStatusObject[];
  label?: string;
  uuid: string;
  allocationUuid?: string;
  results: ResultObject[];
  sample?: { uuid: string; display: string };
  order?: {
    orderer: string;
    concept: string;
    uuid: string;
  };
  orderUuid?: string;
  finalResult?: ResultObject;
  resultApprovalConfiguration?: any;
  testRelationshipConceptSourceUuid?: string;
  isSetMember?: boolean;
  instrument?: any;
  relatedTo?: any;
  savedOnce?: boolean;
}

export class SampleAllocation {
  constructor(public allocation: SampleAllocationObject) {}

  get id(): string {
    return this.allocation?.uuid;
  }

  get uuid(): string {
    return this.allocation?.uuid;
  }
  get isSet(): boolean {
    return this.allocation?.isSet;
  }

  get container(): ConceptGet {
    return this.allocation?.container;
  }

  get allocationUuid(): string {
    return this.allocation?.uuid;
  }

  get parameter(): any {
    return {
      ...this.allocation?.parameter,
      relatedTo: this.allocation?.parameter?.mappings
        ? (this.allocation?.parameter?.mappings?.filter(
            (mapping: any) =>
              mapping?.conceptReference?.conceptSource?.uuid ===
              this.allocation?.testRelationshipConceptSourceUuid
          ) || [])[0]?.conceptReference
        : null,
    };
  }

  get sample(): any {
    return this.allocation?.sample;
  }

  get order(): any {
    return this.allocation?.order;
  }

  get orderUuid(): string {
    return this.allocation?.order?.uuid;
  }

  get statuses(): AlloCationStatusObject[] {
    return this.allocation?.statuses;
  }

  get results(): ResultObject[] {
    return this.allocation?.results.map((result: ResultObject) => {
      return {
        ...result,
        resultGroupUuid: result?.resultGroup?.uuid,
        statuses: this.allocation?.statuses?.filter(
          (status) => status?.result && status?.result?.uuid === result?.uuid
        ),
        parameter: this.allocation?.parameter,
        remarksStatus: (this.allocation?.statuses?.filter(
          (status) =>
            status?.result &&
            status?.result?.uuid === result?.uuid &&
            status?.category === "RESULT_REMARKS"
        ) || [])[0],
        authorizationStatus: (this.allocation?.statuses?.filter(
          (status) =>
            status?.result &&
            status?.result?.uuid === result?.uuid &&
            status?.status === "AUTHORIZED"
        ) || [])[0],
        value: result?.valueNumeric
          ? result?.valueNumeric
          : result?.valueBoolean
          ? result?.valueBoolean
          : result?.valueComplex
          ? result?.valueComplex
          : result?.valueCoded
          ? result?.valueCoded
          : result?.valueText
          ? result?.valueText
          : result?.valueModifier
          ? result?.valueModifier
          : null,
      };
    });
  }

  get finalResult(): any {
    const formattedResults =
      this.allocation?.results?.length > 0
        ? orderBy(
            this.allocation?.results?.map((result) => {
              return {
                ...result,
                creator: {
                  ...result?.creator,
                  display: result?.creator?.display?.split(" (")[0],
                },
                savedOnce: this.allocation?.results?.length === 1,
                parameter: this.allocation?.parameter,
                value: result?.valueBoolean
                  ? result?.valueBoolean
                  : result?.valueCoded
                  ? result?.valueCoded?.uuid
                  : result?.valueComplex
                  ? result?.valueComplex
                  : result?.valueNumeric
                  ? result?.valueNumeric
                  : result?.valueText
                  ? result?.valueText
                  : result?.valueModifier,
                resultGroupUuid: !result?.resultGroup?.uuid
                  ? "NONE"
                  : result?.resultGroup?.uuid,
                resultGroupDateCreated: result?.resultGroup?.uuid
                  ? result?.resultGroup?.dateCreated
                  : null,
              };
            }),
            ["dateCreated"],
            ["desc"]
          )
        : [];
    const finalResult =
      formattedResults[0] && formattedResults[0]?.resultGroupUuid == "NONE"
        ? formattedResults[0]
        : formattedResults[0] && formattedResults[0]?.resultGroupUuid !== "NONE"
        ? groupBy(formattedResults, "resultGroupUuid")
        : null;
    const hasResultsGroup =
      formattedResults[0] && formattedResults[0]?.resultGroupUuid !== "NONE";

    const formattedFinalResultPart = !hasResultsGroup
      ? {
          ...finalResult,
          statuses:
            this.allocation?.statuses?.filter(
              (status) => status?.result?.uuid === finalResult?.uuid
            ) || [],
          authorizationStatuses: (
            this.allocation?.statuses?.filter(
              (status) => status?.category === "RESULT_AUTHORIZATION"
            ) || []
          )?.map((authStatus) => {
            return {
              ...authStatus,
              user: {
                ...authStatus?.user,
                display: authStatus?.user?.display?.split(" (")[0],
              },
            };
          }),
        }
      : {
          groups: orderBy(
            Object.keys(finalResult)?.map((key) => {
              const authorizationIsReady =
                Number(this.allocation?.resultApprovalConfiguration) <=
                (
                  this.allocation?.statuses?.filter(
                    (status) =>
                      status?.category === "RESULT_AUTHORIZATION" &&
                      status?.status == "AUTHORIZED"
                  ) || []
                )?.length;
              return {
                key,
                dateCreated: finalResult[key][0]?.dateCreated,
                results: finalResult[key],
                resultApprovalConfiguration: Number(
                  this.allocation?.resultApprovalConfiguration
                ),
                authorizationStatuses: (
                  this.allocation?.statuses?.filter(
                    (status) => status?.category === "RESULT_AUTHORIZATION"
                  ) || []
                )?.map((authStatus) => {
                  return {
                    ...authStatus,
                    user: {
                      ...authStatus?.user,
                      display: authStatus?.user?.display?.split(" (")[0],
                    },
                  };
                }),
                authorizationIsReady: authorizationIsReady,
              };
            }),
            ["dateCreated"],
            ["asc"]
          ),
          statuses:
            this.allocation?.statuses?.filter(
              (status) => status?.result?.uuid === finalResult?.uuid
            ) || [],
          authorizationStatuses: (
            this.allocation?.statuses?.filter(
              (status) => status?.category === "RESULT_AUTHORIZATION"
            ) || []
          )?.map((authStatus) => {
            return {
              ...authStatus,
              user: {
                ...authStatus?.user,
                display: authStatus?.user?.display?.split(" (")[0],
              },
            };
          }),
        };
    return finalResult
      ? {
          ...{
            ...formattedFinalResultPart,
          },
          statuses:
            this.allocation?.statuses?.filter(
              (status) => status?.result?.uuid === finalResult?.uuid
            ) || [],
          authorizationStatuses: (
            this.allocation?.statuses?.filter(
              (status) => status?.category === "RESULT_AUTHORIZATION"
            ) || []
          )?.map((authStatus) => {
            return {
              ...authStatus,
              user: {
                ...authStatus?.user,
                display: authStatus?.user?.display?.split(" (")[0],
              },
            };
          }),
          authorizationIsReady:
            formattedFinalResultPart?.authorizationStatuses?.length > 0,
        }
      : null;
  }

  get savedOnce(): any {
    return this.results?.length === 1 ? true : false;
  }

  get authorizationStatuses(): any[] {
    return (
      this.allocation?.statuses?.filter(
        (status) => status?.category === "RESULT_AUTHORIZATION"
      ) || []
    );
  }

  get secondAuthorizationStatuses(): any[] {
    return (
      this.allocation?.statuses?.filter(
        (status) =>
          status?.category === "RESULT_AUTHORIZATION" &&
          status?.status == "SECOND_APPROVAL"
      ) || []
    );
  }

  get resultApprovalConfiguration(): any {
    return this.allocation?.resultApprovalConfiguration;
  }

  get isSetMember(): boolean {
    return this.allocation?.isSetMember;
  }

  get instrument(): any {
    return !this.finalResult?.groups
      ? this.finalResult?.instrument
      : this.finalResult?.groups?.length > 0
      ? this.finalResult?.groups[this.finalResult?.groups?.length - 1]
          ?.results[0]?.instrument
      : null;
  }

  get testRelationshipConceptSourceUuid(): string {
    return this.allocation?.testRelationshipConceptSourceUuid;
  }

  toJson(): SampleAllocationObject {
    return {
      id: this.id,
      uuid: this.uuid,
      allocationUuid: this.allocationUuid,
      isSet: this.isSet,
      container: this.container,
      parameter: this.parameter,
      sample: this.sample,
      order: this.order,
      orderUuid: this.orderUuid,
      statuses: this.statuses,
      results: this.results,
      finalResult: this.finalResult,
      isSetMember: this.isSetMember,
      instrument: this.instrument,
      testRelationshipConceptSourceUuid: this.testRelationshipConceptSourceUuid,
      relatedTo: this.parameter?.relatedTo,
      savedOnce: this.savedOnce,
    };
  }
}
