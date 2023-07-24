import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Api, FormGet } from "src/app/shared/resources/openmrs";
import { OpenmrsHttpClientService } from "../../openmrs-http-client/services/openmrs-http-client.service";
import { getFormQueryFields } from "../helpers/get-form-query-field.helper";
import { getSanitizedFormObject } from "../helpers/get-sanitized-form-object.helper";
import { FormConfig } from "../models/form-config.model";
import { ICAREForm } from "../models/form.model";
import { orderBy, uniqBy, omit, keyBy, groupBy, sumBy, flatten } from "lodash";

@Injectable({ providedIn: "root" })
export class FormService {
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  getForms(formConfigs: FormConfig[]): Observable<ICAREForm[]> {
    return zip(
      ...(formConfigs || []).map((formConfig) =>
        from(this.getForm(formConfig.name, formConfig.formLevel))
      )
    ).pipe(
      map((forms) => {
        return (forms || []).filter((form) => form);
      })
    );
  }

  async getForm(formName: string, queryLevel: number): Promise<any> {
    const formConceptResult = await this.api.concept.getAllConcepts({
      name: formName,
      v: `custom:${getFormQueryFields(queryLevel)}`,
    });

    const formConcept: any = (formConceptResult?.results || [])[0];

    return getSanitizedFormObject(formConcept);
  }

  searchItem(
    parameters,
    searchControlType?,
    filteringItems?,
    field?
  ): Observable<any[]> {
    if (parameters?.class === "Diagnosis") {
      return from(this.api.concept.getAllConcepts(parameters)).pipe(
        map((response) => {
          return orderBy(
            response.results.filter(
              (result: any) =>
                parameters?.class &&
                result.conceptClass?.display.toLowerCase() ===
                  parameters?.class.toLowerCase()
            ) || [],
            ["display"],
            ["asc"]
          );
        })
      );
    } else if (!searchControlType || searchControlType === "concept") {
      if (parameters?.value) {
        return from(this.api.concept.getConcept(parameters?.value)).pipe(
          map((response) => {
            return [response];
          })
        );
      } else {
        let params = omit(parameters, "value");
        const hasSearchTerm = field?.searchTerm ? true : false;
        params = {
          ...params,
          q: hasSearchTerm ? field?.searchTerm : params?.q,
        };
        return from(this.api.concept.getAllConcepts(params)).pipe(
          map((response) => {
            const concepts = orderBy(
              (
                response.results.filter(
                  (result: any) =>
                    parameters?.class &&
                    result.conceptClass?.display.toLowerCase() ===
                      (field?.isDiagnosis
                        ? "diagnosis"
                        : parameters?.class.toLowerCase())
                ) || []
              )?.map((result) => {
                return {
                  ...result,
                  display:
                    result?.display?.indexOf(":") > -1
                      ? result?.display?.split(":")[1]
                      : result?.display,
                  name:
                    result?.display?.indexOf(":") > -1
                      ? result?.display?.split(":")[1]
                      : result?.display,
                };
              }),
              ["display"],
              ["asc"]
            );
            if (!hasSearchTerm) {
              return concepts;
            } else if (
              hasSearchTerm &&
              parameters?.q?.toLowerCase() != field?.searchTerm?.toLowerCase()
            ) {
              return concepts?.filter((listItem) => {
                if (
                  listItem?.name
                    ?.toLowerCase()
                    ?.indexOf(parameters?.q?.toLowerCase()) > -1
                ) {
                  return listItem;
                }
              });
            } else {
              return concepts;
            }
          })
        );
      }
    } else if (searchControlType === "person") {
      return from(this.api.person.getAllPersons({ q: parameters?.q })).pipe(
        map((response) => {
          return response?.results;
        })
      );
    } else if (searchControlType === "patient") {
      return from(this.api.patient.getAllPatients({ q: parameters?.q })).pipe(
        map((response) => {
          return response?.results;
        })
      );
    } else if (searchControlType === "provider") {
      return from(this.api.provider.getAllProviders({ q: parameters?.q })).pipe(
        map((response) => {
          return response?.results;
        })
      );
    }else if(searchControlType === "appointmenttype") {
      return from(this.api.appointmentscheduling.getAllAppointmentTypes({ q: parameters?.q })).pipe(
        map((response) => {
          return response?.results;
        })
      );
    } else if (searchControlType === "timeslot") {
      console.log(parameters)
      return from(this.api.appointmentscheduling.getAllTimeSlots({ q: parameters?.q, appointmentType:"dd2ab965-6630-4dbd-a69b-87d909cd1b2c" })).pipe(
        map((response) => {
          return response?.results;
        })
      );
    }
    else if (searchControlType === "user") {
      return from(this.api.user.getAllUsers({ q: parameters?.q })).pipe(
        map((response) => {
          return response?.results || [];
        })
      );
    } else if (searchControlType === "location") {
      return from(
        this.api.location.getAllLocations({
          q: parameters?.q ? parameters?.q : null,
          v: parameters?.v,
          tag: !parameters?.q ? parameters?.tag : null,
        })
      ).pipe(
        map((response) => {
          return response?.results || [];
        })
      );
    } else if (searchControlType === "searchFromOptions") {
      return of(
        field?.options.filter(
          (option) =>
            option?.name.toLowerCase().indexOf(parameters?.q.toLowerCase()) >
              -1 ||
            option?.formField?.label
              .toLowerCase()
              .indexOf(parameters?.q.toLowerCase()) > -1
        )
      );
    } else if (searchControlType === "billableItem") {
      return this.httpClient
        .get(
          `icare/item?limit=${parameters?.limit}&startIndex=0${
            "&q=" + parameters?.q.toLowerCase()
          }`
        )
        .pipe(
          map((response) => {
            return orderBy(
              uniqBy(
                response?.results
                  .map((result) => {
                    return {
                      stockable: result?.stockable,
                      uuid: result?.uuid,
                      display: result?.display,
                      unit: result?.unit,
                    };
                  })
                  .filter((item) => item?.stockable),
                "display"
              ),
              ["display"],
              ["asc"]
            );
          })
        );
    } else if (searchControlType === "conceptreferenceterm") {
      let query = {};
      if (parameters?.source) {
        query["source"] = parameters?.source;
      }

      if (parameters?.q) {
        query["q"] = parameters?.q;
      }

      return from(
        this.api.conceptreferenceterm.getAllConceptReferenceTerms(query)
      ).pipe(
        map((response) =>
          response?.results.map((result) => {
            return {
              ...result,
              display: result?.display.split(": ")[1],
            };
          })
        ),
        catchError((error) => of(error))
      );
    } else if (searchControlType === "Drug") {
      const formattedParamters = omit(parameters, "class", "v");
      const keyedDispensingLocations = keyBy(
        filteringItems?.applicable,
        "uuid"
      );
      const dispensableStock = keyBy(
        filteringItems.items.filter(
          (item) => keyedDispensingLocations[item?.location?.uuid]
        ) || [],
        "name"
      );
      return from(
        this.api.drug.getAllDrugs({ ...formattedParamters, v: "full" })
      ).pipe(
        map((response) => {
          const formattedData = response?.results.map((result: any) => {
            const shouldFeedQuantity =
              dispensableStock[result?.display]?.display.indexOf(":") > -1
                ? ":true"
                : ":false";
            return {
              ...result,
              isDrug: true,
              shouldFeedQuantity,
              formattedKey:
                result?.uuid + ":" + result?.concept?.uuid + shouldFeedQuantity,
              name: dispensableStock[result?.display]
                ? dispensableStock[result?.display]?.display
                : result?.display,
              display: dispensableStock[result?.display]
                ? dispensableStock[result?.display]?.display
                : result?.display,
            };
          });
          // console.log('formattedData', formattedData);
          return formattedData;
        })
      );
      // this.drugs = drugsResults?.results || [];
      // return formatDrugs(this.drugs);)
    } else if (searchControlType === "drugStock") {
      let stockOutItemsReference = {};
      return zip(
        ...["stock?locationUuid", "stockout?location"].map((stockApiPath) => {
          return this.httpClient
            .get(
              `store/${stockApiPath}=${field?.locationUuid}&q=${parameters?.q}`
            )
            .pipe(
              map((response) => {
                let formattedResponse = [];
                if (stockApiPath === "stockout?location") {
                  formattedResponse = response?.map((responseItem) => {
                    stockOutItemsReference[responseItem?.uuid] = responseItem;
                    return {
                      ...responseItem,
                      item: {
                        drug: responseItem?.drug,
                        uuid: responseItem?.uuid,
                      },
                      quantity: 0,
                    };
                  });
                } else {
                  formattedResponse = response;
                }
                const groupedByItemUuid = groupBy(
                  formattedResponse.map((batch) => {
                    return {
                      ...batch,
                      itemUuid: batch?.item?.uuid,
                    };
                  }),
                  "itemUuid"
                );
                return Object.keys(groupedByItemUuid).map((itemUuid) => {
                  const totalQuantity = Number(
                    sumBy(
                      groupedByItemUuid[itemUuid].map((batchData) => {
                        return batchData;
                      }),
                      "quantity"
                    )
                  );
                  return {
                    uuid: groupedByItemUuid[itemUuid][0]?.item?.drug?.uuid,
                    id: groupedByItemUuid[itemUuid][0]?.item?.drug?.uuid,
                    display:
                      groupedByItemUuid[itemUuid][0]?.item?.drug?.display +
                      " (" +
                      totalQuantity.toLocaleString("en-US") +
                      ") ",
                    itemUuid,
                    value: groupedByItemUuid[itemUuid][0]?.item?.drug?.uuid,
                    batches: groupedByItemUuid[itemUuid],
                    name: groupedByItemUuid[itemUuid][0]?.item?.drug?.display,
                    quantity: totalQuantity,
                    isStockOut: totalQuantity === 0 ? true : false,
                  };
                });
              })
            );
        })
      ).pipe(
        map((responses) => {
          const allDrugItems = orderBy(
            flatten(responses),
            ["display", ["quantity"]],
            ["asc"]["asc"]
          );
          const drugIitemsGroupedByItemUuid = groupBy(allDrugItems, "itemUuid");
          const formattedDrugItems = Object.keys(
            drugIitemsGroupedByItemUuid
          ).map((itemUuid) => {
            const totalQuantity = Number(
              sumBy(
                drugIitemsGroupedByItemUuid[itemUuid].map((batchData) => {
                  return batchData;
                }),
                "quantity"
              )
            );
            return {
              ...drugIitemsGroupedByItemUuid[itemUuid][0],
              batches: drugIitemsGroupedByItemUuid[itemUuid],
              display:
                drugIitemsGroupedByItemUuid[itemUuid][0]?.name +
                " (" +
                totalQuantity.toLocaleString("en-US") +
                ") ",
              quantity: totalQuantity,
              isStockOut: totalQuantity === 0 ? true : false,
            };
          });
          return formattedDrugItems;
        })
      );
    } else if (searchControlType === "residenceLocation") {
      return from(
        this.api.location.getAllLocations({
          q: parameters?.q ? parameters?.q : null,
          v: parameters?.v,
        })
      ).pipe(
        map((response) => {
          // TODO: Remove the hardcoded 'village' by creating a new location API that respondto search and tag together
          return (
            response?.results?.filter(
              (village: any) =>
                village?.display?.toLowerCase()?.indexOf("village") > -1 ||
                village?.display?.toLowerCase()?.indexOf("street") > -1
            ) || []
          );
        })
      );
    } else if (searchControlType === "healthFacility") {
      return from(
        this.api.location.getAllLocations({
          q: parameters?.q ? parameters?.q : null,
          v: parameters?.v,
        })
      ).pipe(
        map((response) => {
          return (
            response?.results?.filter(
              (facility: any) =>
                facility?.display?.toLowerCase()?.indexOf("dispensary") > -1 ||
                facility?.display?.toLowerCase()?.indexOf("hospital") > -1 ||
                facility?.display?.toLowerCase()?.indexOf("health") > -1 ||
                facility?.display?.toLowerCase()?.indexOf("clinic") > -1
            ) || []
          )?.map((location: any) => {
            return {
              ...location,
              display:
                location?.display +
                (location?.parentLocation &&
                location?.parentLocation?.parentLocation
                  ? " -  ( " +
                    location?.parentLocation?.parentLocation?.display +
                    " - " +
                    location?.parentLocation?.parentLocation?.parentLocation
                    ? location?.parentLocation?.parentLocation?.parentLocation
                        ?.display
                    : "" + " )"
                  : ""),
            };
          });
        })
      );
    } else if (searchControlType === "form") {
      return from(
        this.api.form.getAllForms({
          q: parameters?.q ? parameters?.q : null,
          v: parameters?.v,
        })
      ).pipe(
        map((response) => {
          return response?.results || [];
        })
      );
    }
  }

  getCustomeOpenMRSForm(uuid): Observable<any> {
    /**
     * TODO:Dynamicall construct the fields
     */
    const fields =
      "?v=custom:(uuid,display,name,encounterType,formFields:(uuid,display,fieldNumber,required,retired,fieldPart,maxOccurs,pageNumber,minOccurs,field:(uuid,display,concept:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,setMembers:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,answers,setMembers:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,answers)),answers:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,answers)))))";
    return this.httpClient.get("form/" + uuid + fields).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getCustomeOpenMRSForms(uuids): Observable<any> {
    return zip(
      ...uuids.map((uuid) => {
        return from(this.getCustomeOpenMRSForm(uuid));
      })
    ).pipe(
      map((formResponse: any) => {
        return formResponse;
      })
    );
  }
}
