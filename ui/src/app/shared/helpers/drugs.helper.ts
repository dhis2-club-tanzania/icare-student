import { formatDateToString } from "./format-date.helper";

/**
 * Arrange drug details from drug order, specificDrugConceptUUid and prescription arrangements
 * @param drugOrder The object of drug order
 * @param specificDrugConceptUuid UUID of specific drug concept usedf to create observation which stores drug name
 * @param prescriptionArrangementFields Settings of all drug prescription fields
 * @returns The drug order object with arrangement details inside such as name, description, date, time, provider and category
 */
export function arrangeDrugDetails(drugOrder: any, specificDrugConceptUuid: any, prescriptionArrangementFields: any){
    return {
        ...drugOrder,
        name: drugOrder.obs[specificDrugConceptUuid]
            ? drugOrder.obs[specificDrugConceptUuid]?.comment
            : drugOrder?.display,
        description: `${drugOrder.obs[prescriptionArrangementFields["1"]?.uuid]?.value
                ?.display
                ? drugOrder.obs[prescriptionArrangementFields["1"]?.uuid]?.value
                    ?.display
                : drugOrder.obs[prescriptionArrangementFields["1"]?.uuid]?.value || ''
                } ${drugOrder.obs[prescriptionArrangementFields["2"]?.uuid]?.value
                ?.display
                ? '(' + drugOrder.obs[prescriptionArrangementFields["2"]?.uuid]?.value
                    ?.display + ')'
                : drugOrder.obs[prescriptionArrangementFields["2"]?.uuid]?.value || ''
                } ${drugOrder.obs[prescriptionArrangementFields["3"]?.uuid]?.value
                ?.display
                ? drugOrder.obs[prescriptionArrangementFields["3"]?.uuid]?.value
                    ?.display
                : drugOrder.obs[prescriptionArrangementFields["3"]?.uuid]?.value || ''
            } ${drugOrder.obs[prescriptionArrangementFields["4"]?.uuid]?.value
                ?.display
                ? drugOrder.obs[prescriptionArrangementFields["4"]?.uuid]?.value
                    ?.display
                : drugOrder.obs[prescriptionArrangementFields["4"]?.uuid]?.value || ''
            } ${drugOrder.obs[prescriptionArrangementFields["5"]?.uuid]?.value
                ?.display
                ? drugOrder.obs[prescriptionArrangementFields["5"]?.uuid]?.value
                    ?.display
                : drugOrder.obs[prescriptionArrangementFields["5"]?.uuid]?.value || ''
            } ${drugOrder.obs[prescriptionArrangementFields["6"]?.uuid]?.value
                ?.display
                ? drugOrder.obs[prescriptionArrangementFields["6"]?.uuid]?.value
                    ?.display
                : drugOrder.obs[prescriptionArrangementFields["6"]?.uuid]?.value || ''
            }`,
        date: formatDateToString(new Date(drugOrder.dateActivated), "DD-MM-YYYY"),
        time: formatDateToString(new Date(drugOrder.dateActivated), "hh:mm:ss"),
        provider: drugOrder?.orderer?.display?.split('-')[1],
        category: "DRUG_ORDER",
    };
}