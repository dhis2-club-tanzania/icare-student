import { Injectable } from "@angular/core";
import {
  Api,
  ConceptCreate,
  ConceptCreateFull,
  ConceptGet,
  ConceptGetFull,
} from "../../openmrs";
import { Observable, from, of, zip } from "rxjs";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { catchError, map } from "rxjs/operators";
import { flatten, omit } from "lodash";

@Injectable({
  providedIn: "root",
})
export class ConceptsService {
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  getConceptDetails(name: string, fields: string): Observable<any> {
    return from(
      this.api.concept.getAllConcepts({ name: name, v: fields })
    ).pipe(
      map((response: any) => {
        return {
          ...response,
          display:
            response?.display?.indexOf(":") > -1
              ? response?.display?.split(":")[1]
              : response?.display,
          setMembers: response?.setMembers?.map((setMember) => {
            return {
              ...setMember,
              display:
                setMember?.display?.indexOf(":") > -1
                  ? setMember?.display?.split(":")[1]
                  : setMember?.display,
              name:
                setMember?.display?.indexOf(":") > -1
                  ? setMember?.display?.split(":")[1]
                  : setMember?.display,
            };
          }),
          answers: response?.answers?.map((answer) => {
            return {
              ...answer,
              display:
                answer?.display?.indexOf(":") > -1
                  ? answer?.display?.split(":")[1]
                  : answer?.display,
              name:
                answer?.display?.indexOf(":") > -1
                  ? answer?.display?.split(":")[1]
                  : answer?.display,
            };
          }),
        };
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getConceptDetailsByUuid(uuid: string, fields?: string): Observable<any> {
    fields = fields && fields.length > 0 ? "?v=" + fields : "";
    return this.httpClient.get("concept/" + uuid + fields).pipe(
      map((response) => {
        return {
          ...response,
          display:
            response?.display?.indexOf(":") > -1
              ? response?.display?.split(":")[1]
              : response?.display,
          name:
            response?.display?.indexOf(":") > -1
              ? response?.display?.split(":")[1]
              : response?.display,
          names: response?.names?.map((name) => {
            return {
              ...name,
              display:
                name?.display?.indexOf(":") > -1
                  ? name?.display?.split(":")[1]
                  : name?.display,
              name:
                name?.display?.indexOf(":") > -1
                  ? name?.display?.split(":")[1]
                  : name?.display,
            };
          }),
          answers:
            response?.answers && response?.answers?.length > 0
              ? response?.answers.map((answer) => {
                  return {
                    ...answer,
                    display:
                      answer?.display?.indexOf(":") > -1
                        ? answer?.display?.split(":")[1]
                        : answer?.display,
                    name:
                      answer?.display?.indexOf(":") > -1
                        ? answer?.display?.split(":")[1]
                        : answer?.display,
                    code:
                      answer?.names && answer?.names?.length > 0
                        ? (answer?.names?.filter(
                            (name) => name?.conceptNameType === "SHORT"
                          ) || [])[0]?.name
                        : "",
                  };
                })
              : [],
          setMembers: response?.setMembers
            ? response?.setMembers?.map((setMember) => {
                return {
                  ...setMember,
                  display:
                    setMember?.display?.indexOf(":") > -1
                      ? setMember?.display?.split(":")[1]
                      : setMember?.display,
                  name:
                    setMember?.display?.indexOf(":") > -1
                      ? setMember?.display?.split(":")[1]
                      : setMember?.display,
                };
              })
            : [],
        };
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getDepartmentDetails(referenceConcept: string): Observable<any> {
    return this.httpClient
      .get(
        "concept/" +
          referenceConcept +
          "?v=custom:(uuid,display,setMembers:(uuid,display,setMembers:(uuid,display)))"
      )
      .pipe(
        map((response) => {
          const departments = response?.setMembers;
          return flatten(
            departments.map((department) => {
              return department?.setMembers.map((item) => {
                return {
                  ...item,
                  department: {
                    display:
                      item?.display?.indexOf(":") > -1
                        ? item?.display?.split(":")[1]
                        : item?.display,
                    name:
                      item?.display?.indexOf(":") > -1
                        ? item?.display?.split(":")[1]
                        : item?.display,
                    uuid: item?.uuid,
                  },
                };
              });
            })
          );
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }

  createConcept(data: any): Observable<ConceptCreateFull> {
    return from(this.api.concept.createConcept(data)).pipe(
      map((response) => response),
      catchError((error) => {
        return of(error);
      })
    );
  }

  createConceptNames(
    parentUuid,
    conceptNames: any[]
  ): Observable<ConceptCreateFull> {
    return conceptNames?.length > 0
      ? zip(
          ...conceptNames.map((conceptNameData) =>
            from(
              this.api.concept.createConceptName(parentUuid, conceptNameData)
            ).pipe(
              map((response) => {
                return response?.results;
              }),
              catchError((error) => of([]))
            )
          )
        ).pipe(
          map((response: any) => {
            return flatten(response);
          })
        )
      : of([]);
  }

  updateConcept(uuid: string, data: any): Observable<ConceptCreateFull> {
    return zip(
      from(this.api.concept.updateConcept(uuid, omit(data, "answers"))),
      data?.answers?.length > 0
        ? this.httpClient.post(`icare/concept/${uuid}/answers`, data?.answers)
        : of(null)
    ).pipe(
      map((responses) => responses[0]),
      catchError((error) => {
        return of(error);
      })
    );
  }

  updateConceptAttribute(conceptUuid: string, data: any): Observable<any> {
    return from(
      this.api.concept.updateConceptAttribute(conceptUuid, data?.uuid, data)
    ).pipe(
      map((response) => response),
      catchError((error) => {
        return of(error);
      })
    );
  }

  searchConcept(parameters: any): Observable<ConceptGet[]> {
    let queryParams = "";
    if (parameters?.q) {
      queryParams = "q=" + parameters?.q;
    }
    if (parameters?.limit) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") + "limit=" + parameters?.limit;
    }

    if (parameters?.startIndex) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "startIndex=" +
        parameters?.startIndex;
    }

    if (parameters?.page) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") + "page=" + parameters?.page;
    }

    if (parameters?.pageSize) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "pageSize=" +
        parameters?.pageSize;
      queryParams += (queryParams?.length > 0 ? "&" : "") + "paging=true";
    }

    if (parameters?.conceptClass) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "conceptClass=" +
        parameters?.conceptClass;
    }
    if (parameters?.searchTerm) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "searchTerm=" +
        parameters?.searchTerm;
    }

    if (parameters?.searchTermOfConceptSetToExclude) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "searchTermOfConceptSetToExclude=" +
        parameters?.searchTermOfConceptSetToExclude;
    }

    if (parameters?.conceptSource) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "conceptSource=" +
        parameters?.conceptSource;
    }

    if (parameters?.referenceTermCode) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "referenceTermCode=" +
        parameters?.referenceTermCode;
    }

    if (parameters?.attributeType) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "attributeType=" +
        parameters?.attributeType;
    }

    if (parameters?.attributeValue) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "attributeValue=" +
        parameters?.attributeValue;
    }

    return this.httpClient.get(`icare/concept?${queryParams}`).pipe(
      map((response: any) => {
        return {
          ...response,
          results: response?.results.map((result) => {
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
              names: result?.names?.filter((name) => {
                return {
                  ...name,
                  display:
                    name?.display?.indexOf(":") > -1
                      ? name?.display?.split(":")[1]
                      : name?.display,
                };
              }),
            };
          }),
        };
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getConceptsByParameters(parameters: any): Observable<ConceptGetFull[]> {
    let query = {};
    if (parameters?.searchingText) {
      query["q"] = parameters?.searchingText;
    }
    if (parameters?.pageSize) {
      query["limit"] = parameters?.pageSize;
    }

    if (parameters?.page && parameters?.pageSize) {
      query["startIndex"] = (parameters?.page - 1) * parameters?.pageSize + 1;
    }

    if (parameters?.class) {
      query["class"] = parameters?.class;
    }
    if (parameters?.code) {
      query["code"] = parameters?.code;
    }
    return from(this.api.concept.getAllConcepts(query)).pipe(
      map((response) => {
        return response?.results.map((result) => {
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
        });
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getConceptsAsCodedAnswers(parameters): Observable<ConceptGetFull[]> {
    let query = {};
    if (parameters?.searchingText) {
      query["q"] = parameters?.searchingText;
    }
    if (parameters?.pageSize) {
      query["limit"] = parameters?.pageSize;
    }

    if (parameters?.page && parameters?.pageSize) {
      query["startIndex"] = (parameters?.page - 1) * parameters?.pageSize + 1;
    }
    return from(this.api.concept.getAllConcepts(query)).pipe(
      map((response) => {
        return response?.results.map((result) => {
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
        });
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getConceptsBySearchTerm(
    searchTerm: string,
    fields?: string
  ): Observable<ConceptGetFull[]> {
    return from(
      this.api.concept.getAllConcepts({
        q: searchTerm,
        v: !fields
          ? "custom:(uuid,display,names,descriptions,setMembers:(uuid,display,datatype,attributes:(uuid,display,value,attributeType:(uuid,display)),answers:(uuid,display),setMembers:(uuid,display,attributes:(uuid,display,value,attributeType:(uuid,display)),datatype,answers:(uuid,display))))"
          : fields,
      })
    ).pipe(
      map((response) => {
        return response?.results.map((result: ConceptGetFull) => {
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
            setMembers: result?.setMembers
              ? result?.setMembers?.map((setMember) => {
                  return {
                    ...setMember,
                    display:
                      setMember?.display?.indexOf(":") > -1
                        ? setMember?.display?.split(":")[1]
                        : setMember?.display,
                    name:
                      setMember?.display?.indexOf(":") > -1
                        ? setMember?.display?.split(":")[1]
                        : setMember?.display,
                  };
                })
              : [],
            answers: result?.answers
              ? result?.answers?.map((answer) => {
                  return {
                    ...answer,
                    display:
                      answer?.display?.indexOf(":") > -1
                        ? answer?.display?.split(":")[1]
                        : answer?.display,
                    name:
                      answer?.display?.indexOf(":") > -1
                        ? answer?.display?.split(":")[1]
                        : answer?.display,
                  };
                })
              : [],
          };
        });
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  deleteConcept(id: string, purge?: boolean): Observable<ConceptGetFull> {
    return from(this.api.concept.deleteConcept(id, { purge: purge })).pipe(
      map((response) => response),
      catchError((error) => {
        return of(error);
      })
    );
  }

  unRetireConcept(id: string): Observable<ConceptGetFull> {
    return this.httpClient
      .post(`icare/concept/${id}/retire`, { retire: false })
      .pipe(
        map((response) => response),
        catchError((error) => {
          return of(error);
        })
      );
  }

  createBillable(uuid: any) {
    throw new Error("Method not implemented.");
  }

  getConceptSetsByConceptUuids(uuids: string[]): Observable<ConceptGetFull[]> {
    return zip(
      ...uuids.map((uuid) =>
        this.httpClient.get(`icare/conceptsets?concept=${uuid}`).pipe(
          map(
            (response) =>
              response?.results?.map((result) => {
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
                  concept: uuid,
                  testOrder: uuid,
                  setMembers: [
                    {
                      uuid,
                    },
                  ],
                };
              }) || []
          )
        )
      )
    ).pipe(
      map((data) => {
        return flatten(data);
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getConceptsAttributes(): Observable<any> {
    return from(
      this.api.conceptattributetype.getAllConceptAttributeTypes({ v: "full" })
    ).pipe(
      map((response) => {
        return response?.results;
      })
    );
  }

  getConceptByMappingSource(source: string, fields?: string) {
    return from(
      this.api.concept.getAllConcepts({
        source: source,
        v: !fields
          ? "custom:(uuid,display,names,descriptions,setMembers:(uuid,display,datatype,attributes:(uuid,display,value,attributeType:(uuid,display)),answers:(uuid,display),setMembers:(uuid,display,attributes:(uuid,display,value,attributeType:(uuid,display)),datatype,answers:(uuid,display))))"
          : fields,
      })
    ).pipe(
      map((data) => {
        return data;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getConceptsWithItemsDetails(parameters?: any): Observable<any> {
    return this.httpClient
      .get(`icare/conceptswithitems?${parameters ? parameters.join("&") : ""}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }

  updateItemStockableStatus(payload): Observable<any> {
    return this.httpClient.put(`icare/item`, payload).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
}
