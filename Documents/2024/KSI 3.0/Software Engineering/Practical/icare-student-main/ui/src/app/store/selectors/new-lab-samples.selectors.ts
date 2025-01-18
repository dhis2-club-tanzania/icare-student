import { createSelector } from "@ngrx/store";
import { getRootState, AppState } from "../reducers";
import { newLabSamplesAdapter, NewLabSamplesState } from "../states";

import * as _ from "lodash";
import { getLISConfigurations } from "./lis-configurations.selectors";

const getSamplesState = createSelector(
  getRootState,
  (state: AppState) => state.samples
);

export const getFormattedLabSamplesLoadedState = createSelector(
  getSamplesState,
  (state: NewLabSamplesState) => state.loaded
);

export const {
  selectAll: getAllFormattedLabSamples,
  selectEntities: getAllFormattedLabSampleEntities,
} = newLabSamplesAdapter.getSelectors(getSamplesState);

export const getPatientsSamplesToCollect = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    const patientSamples = _.filter(samples, (sample) => {
      if (!sample?.collected && sample?.patient?.uuid == props?.patient_uuid) {
        return sample;
      }
    });

    // Extract tests not collected from collected samples
    let samplesWithOrdersNotCollected = [];
    _.map(
      _.filter(samples, { collected: true, patient_uuid: props?.patient_uuid }),
      (sample) => {
        const ordersNotCollected = _.filter(sample?.orders, {
          collected: false,
        });
        if (ordersNotCollected?.length > 0) {
          samplesWithOrdersNotCollected = [
            ...samplesWithOrdersNotCollected,
            {
              ...sample,
              orders: ordersNotCollected,
              reCollect: true,
            },
          ];
        }
      }
    );
    const formattedPatientSamples = _.map(patientSamples, (sample) => {
      return {
        ...sample,
        orders: _.uniqBy(
          _.filter(
            _.map(sample?.orders, (order) => {
              return {
                ...order,
                paymentType: order?.p_category + " - " + order?.p_sub_category,
              };
            }),
            (order) => order
          ),
          "concept_uuid"
        ),
      };
    });

    return _.filter(
      [...formattedPatientSamples, ...samplesWithOrdersNotCollected],
      (sample) => {
        if (sample?.orders?.length > 0) {
          return sample;
        }
      }
    );
  }
);

export const getPatientCollectedLabSamples = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    console.log(samples);
    console.log(props);
    const patientSamples =
      (
        _.filter(samples, {
          collected: true,
          rejected: false,
        }) || []
      ).filter((sample) => sample?.patient?.uuid === props?.patient_uuid) || [];
    console.log("patientSamples", patientSamples);
    return patientSamples;
  }
);

export const getFormattedLabSamplesForTracking = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    return _.map(
      _.filter(_.orderBy(samples, ["dateCreated"], ["desc"]), (sample) => {
        if (!props?.searchingText && !props?.department) {
          return sample;
        } else if (props?.searchingText && props?.department) {
          if (
            sample?.searchingText
              ?.toLowerCase()
              .indexOf(props?.searchingText.toLowerCase()) > -1 &&
            sample?.department?.departmentName
              .toLowerCase()
              .indexOf(props?.department?.toLowerCase()) > -1
          ) {
            return sample;
          }
        } else if (props?.searchingText && !props?.department) {
          if (
            sample?.searchingText
              ?.toLowerCase()
              .indexOf(props?.searchingText.toLowerCase()) > -1
          ) {
            return sample;
          }
        } else if (!props?.searchingText && props?.department) {
          if (
            sample?.department?.departmentName
              .toLowerCase()
              .indexOf(props?.department?.toLowerCase()) > -1
          ) {
            return sample;
          }
        }
      }) || [],
      (sample) => {
        return {
          ...sample,
          completed:
            getCompletedOrders(sample?.orders)?.length == sample?.orders?.length
              ? true
              : false,
          atLeastOneHasFirstSignOff:
            getOrdersWithFirstSigOff(sample?.orders)?.length > 0 ? true : false,
          atLeastOneHasResults:
            getOrdersWithResults(sample?.orders)?.length > 0 ? true : false,
          atLestOneOrderWithRejectedResults:
            getOrdersWithRejectedResults(sample?.orders)?.length > 0
              ? true
              : false,
        };
      }
    );
  }
);

export const getAcceptedFormattedLabSamples = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    return (
      _.filter(_.orderBy(samples, ["dateCreated"], ["desc"]), (sample) => {
        if (
          sample?.accepted &&
          !sample?.markedForRecollection &&
          ((sample?.searchingText &&
            sample?.searchingText
              ?.toLowerCase()
              .indexOf(props?.searchingText.toLowerCase()) > -1) ||
            !sample?.searchingText) &&
          sample?.department?.departmentName
            .toLowerCase()
            .indexOf(props?.department?.toLowerCase()) > -1
        ) {
          return sample;
        }
      }) || []
    );
  }
);

export const getFormattedLabSamplesToAccept = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    return (
      _.filter(
        _.orderBy(
          _.filter(samples, {
            accepted: false,
            rejected: false,
            markedForRecollection: false,
          }),
          ["priorityOrderNumber", "dateCreated"],
          ["asc", "desc"]
        ),
        (sample) => {
          if (!props?.searchingText && !props?.department) {
            return sample;
          } else if (props?.searchingText && props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (props?.searchingText && !props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!props?.searchingText && props?.department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || []
    );
  }
);

export const getFormattedRejectedLabSamples = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    const rejectedSamples =
      _.filter(
        _.orderBy(
          _.map(
            _.filter(samples, (sample) => {
              if (sample?.rejected || sample?.markedForRecollection) {
                return sample;
              }
            }),
            (sample) => {
              return {
                ...sample,
                keyForCheckingRecollection:
                  sample?.mrn +
                  "-" +
                  sample?.departmentName +
                  "-" +
                  sample?.specimen?.specimenName,
              };
            }
          ),
          ["priorityOrderNumber", "dateCreated"],
          ["asc", "desc"]
        ),
        (sample) => {
          if (!props?.searchingText && !props?.department) {
            return sample;
          } else if (props?.searchingText && props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (props?.searchingText && !props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!props?.searchingText && props?.department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || [];

    const otherSamples =
      _.filter(
        _.map(samples, (sample) => {
          return {
            ...sample,
            keyForCheckingRecollection:
              sample?.mrn +
              "-" +
              sample?.departmentName +
              "-" +
              sample?.specimen?.name,
          };
        }),
        (sample) => {
          if (!sample?.markedForRecollection && !sample?.rejected) {
            return sample;
          }
        }
      ) || [];
    return rejectedSamples.filter((sample) => {
      if (
        (
          otherSamples.filter(
            (smp) =>
              smp?.keyForCheckingRecollection ===
              sample?.keyForCheckingRecollection
          ) || []
        )?.length === 0
      ) {
        return sample;
      }
    });
  }
);

export const getFormattedAcceptedLabSamples = (
  department: string,
  searchingText: string
) =>
  createSelector(getAllFormattedLabSamples, (samples) => {
    const acceptedSamples =
      _.filter(
        _.orderBy(
          _.map(
            _.filter(samples, (sample) => {
              if (sample?.accepted) {
                return sample;
              }
            }) || [],
            (sample) => {
              return {
                ...sample,
                keyForCheckingRecollection:
                  sample?.mrn +
                  "-" +
                  sample?.departmentName +
                  "-" +
                  sample?.specimen?.specimenName,
              };
            }
          ),
          ["priorityOrderNumber", "dateCreated"],
          ["asc", "desc"]
        ),
        (sample) => {
          if (!searchingText && !department) {
            return sample;
          } else if (searchingText && department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(searchingText?.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                ?.toLowerCase()
                ?.indexOf(department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (searchingText && !department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(searchingText?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!searchingText && department) {
            if (
              sample?.department?.departmentName
                ?.toLowerCase()
                ?.indexOf(department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || [];
    return acceptedSamples;
  });

export const getFormattedLabSamplesToFeedResults = createSelector(
  getAllFormattedLabSamples,
  getLISConfigurations,
  (samples, LISConfigs, props) => {
    const unCompletedSamples = _.map(
      _.filter(samples, (sample) => {
        const completedOrders = getCompletedOrders(sample?.orders);
        if (
          sample?.accepted &&
          !sample?.markedForRecollection &&
          completedOrders?.length !== sample?.orders?.length
        ) {
          return sample;
        }
      }),
      (sample) => {
        return {
          ...sample,
          hasResult:
            getOrdersWithResults(sample?.orders)?.length > 0 ? true : false,
          atLeastOneHasFirstSignOff:
            getOrdersWithFirstSigOff(sample?.orders)?.length > 0 ? true : false,
          atLeastOneHasResults:
            getOrdersWithResults(sample?.orders)?.length > 0 ? true : false,
          atLestOneOrderWithRejectedResults:
            getOrdersWithRejectedResults(sample?.orders)?.length > 0
              ? true
              : false,
        };
      }
    );

    return (
      _.filter(
        _.orderBy(
          !LISConfigs?.isLIS
            ? unCompletedSamples
            : unCompletedSamples?.filter((sample) => !sample?.hasResult) || [],
          ["priorityOrderNumber", "dateCreated"],
          ["asc", "desc"]
        ),
        (sample) => {
          if (!props?.searchingText && !props?.department) {
            return sample;
          } else if (props?.searchingText && props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (props?.searchingText && !props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!props?.searchingText && props?.department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || []
    );
  }
);

export const getLabSamplesWithResults = (department, searchingText) =>
  createSelector(getAllFormattedLabSamples, (samples) => {
    const samplesWithResults = _.filter(samples, (sample) => {
      const ordersWithResults = getOrdersWithResults(sample?.orders);
      if (sample?.accepted && ordersWithResults?.length > 0) {
        return sample;
      }
    });
    return (
      _.filter(
        _.orderBy(
          samplesWithResults,
          ["dateCreated", "priorityOrderNumber"],
          ["asc", "asc"]
        ),
        (sample) => {
          if (!searchingText && !department) {
            return sample;
          } else if (searchingText && department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (searchingText && !department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!searchingText && department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || []
    );
  });

export const getCompletedLabSamples = createSelector(
  getAllFormattedLabSamples,
  getLISConfigurations,
  (samples, lisConfigs, props) => {
    const completedSamples = _.filter(samples, (sample) => {
      const completedOrders = getCompletedOrders(
        sample?.orders,
        lisConfigs?.isLIS
      );
      if (
        sample?.accepted &&
        completedOrders?.length == sample?.orders?.length
      ) {
        return sample;
      }
    });
    return (
      _.filter(
        _.orderBy(
          completedSamples,
          ["dateCreated", "priorityOrderNumber"],
          ["asc", "asc"]
        ),
        (sample) => {
          if (!props?.searchingText && !props?.department) {
            return sample;
          } else if (props?.searchingText && props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (props?.searchingText && !props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!props?.searchingText && props?.department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || []
    );
  }
);

export const getPatientWithResults = (
  department: string,
  searchingText: string
) =>
  createSelector(getAllFormattedLabSamples, (samples: any[]) => {
    const filteredSamplesWithResults =
      _.filter(
        _.orderBy(
          _.filter(samples, (sample) => {
            const ordersWithResults = getOrdersWithResults(sample?.orders);
            if (sample?.accepted && ordersWithResults.length) {
              return sample;
            }
          }),
          ["dateCreated", "priorityOrderNumber"],
          ["asc", "asc"]
        ),
        (sample) => {
          if (!searchingText && !department) {
            return sample;
          } else if (searchingText && department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (searchingText && !department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!searchingText && department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || [];
    const groupedByMRN = _.groupBy(filteredSamplesWithResults, "mrn");

    return _.map(Object.keys(groupedByMRN), (key) => {
      const samplesKeyedByDepartments = _.groupBy(
        groupedByMRN[key],
        "departmentName"
      );
      return {
        mrn: key,
        patient: groupedByMRN[key][0]?.patient,
        departments: _.map(Object.keys(samplesKeyedByDepartments), (dep) => {
          return {
            departmentName: dep,
            samples: samplesKeyedByDepartments[dep],
          };
        }),
      };
    });
  });

export const getPatientsWithCompletedLabSamples = createSelector(
  getAllFormattedLabSamples,
  getLISConfigurations,
  (samples, lisConfigs, props) => {
    const filteredCompletedSamples =
      _.filter(
        _.orderBy(
          _.filter(samples, (sample) => {
            const completedOrders = getCompletedOrders(
              sample?.orders,
              lisConfigs?.isLIS
            );
            if (
              sample?.accepted &&
              completedOrders?.length == sample?.orders?.length
            ) {
              return sample;
            }
          }),
          ["dateCreated", "priorityOrderNumber"],
          ["asc", "asc"]
        ),
        (sample) => {
          if (!props?.searchingText && !props?.department) {
            return sample;
          } else if (props?.searchingText && props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (props?.searchingText && !props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!props?.searchingText && props?.department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || [];
    const groupedByMRN = _.groupBy(filteredCompletedSamples, "mrn");

    return _.map(Object.keys(groupedByMRN), (key) => {
      const samplesKeyedByDepartments = _.groupBy(
        groupedByMRN[key],
        "departmentName"
      );
      return {
        mrn: key,
        patient: groupedByMRN[key][0]?.patient,
        departments: _.map(Object.keys(samplesKeyedByDepartments), (dep) => {
          return {
            departmentName: dep,
            samples: samplesKeyedByDepartments[dep],
          };
        }),
      };
    });
  }
);

export const getFormattedLabSampleOrdersBySampleIdentifier = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    const orderedItemsMatched = (_.filter(samples, {
      id: props?.sampleIdentifier,
    }) || [])[0]?.orders;

    return orderedItemsMatched.map((item) => {
      if (item?.order?.concept?.setMembers?.length > 0) {
        let allocations = {};
        _.each(item?.testAllocations, (all) => {
          allocations[all?.concept?.uuid] = all;
        });

        return {
          ...item,
          allocationsPairedBySetMember: allocations, // keyvalue paired by setmember concept id
        };
      } else {
        return item;
      }
    });
  }
);

export const getFormattedLabSampleBySampleIdentifier = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    return (_.filter(samples, { id: props?.sampleIdentifier }) || [])[0];
  }
);

export const getWorkList = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    const acceptedSamples = _.filter(samples, { accepted: true }) || [];
    if (acceptedSamples?.length === 0) {
      return [];
    }
    return (
      _.filter(
        _.orderBy(
          _.filter(acceptedSamples, (sample) => {
            if (sample?.acceptedBy?.user?.uuid == props?.userUuid) {
              return sample;
            }
          }) || [],
          ["dateCreated"],
          ["desc"]
        ),
        (sample) => {
          if (!props?.searchingText && !props?.department) {
            return sample;
          } else if (props?.searchingText && props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (props?.searchingText && !props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!props?.searchingText && props?.department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || []
    );
  }
);

export const getTestOrdersFromSampleBySampleLabel = (label) =>
  createSelector(getAllFormattedLabSampleEntities, (sampleEntities) => {
    return sampleEntities[label]?.orders;
  });

function getTestAllocationsWithResults(allocations) {
  return _.uniqBy(
    allocations?.map((allocation) => {
      return {
        ...allocation,
        conceptUuid: allocation?.concept?.uuid,
        hasResult: allocation?.results?.length > 0,
      };
    }) || [],
    "conceptUuid"
  )?.filter((allocation) => allocation?.hasResult);
}

function getCompletedOrders(orders, isLIS?: boolean) {
  return (
    _.filter(orders, (order) => {
      const testAllocationsWithResults = getTestAllocationsWithResults(
        order?.testAllocations
      );
      if (
        testAllocationsWithResults?.length > 0 &&
        order?.authorizationInfo?.length > 0
      ) {
        return order;
      }
    }) || []
  );
}

function getOrdersWithFirstSigOff(orders) {
  return (
    _.filter(orders, (order) => {
      if (
        order?.testAllocations?.length > 0 &&
        order?.testAllocations[0]?.firstSignOff
      ) {
        return order;
      }
    }) || []
  );
}

function getOrdersWithResults(orders) {
  let newOrders: any[] = [];

  orders?.forEach((order) => {
    if (order?.testAllocations?.length > 0) {
      order.testAllocations.forEach((test) => {
        if (test.results.length > 0) {
          newOrders = [...newOrders, order];
        }
      });
    }
  });

  return newOrders;
}

function getOrdersWithRejectedResults(orders) {
  return (
    _.filter(orders, (order) => {
      if (
        order?.testAllocations?.length > 0 &&
        _.orderBy(
          order?.testAllocations[0]?.statuses,
          ["timestamp"],
          ["desc"]
        )[0]?.status == "REJECTED"
      ) {
        return order;
      }
    }) || []
  );
}

export const getPatientWithSampleDetails = createSelector(
  getAllFormattedLabSamples,
  (samples, props) => {
    // console.log("samples there :: ", samples)

    const filteredCompletedSamples =
      _.filter(
        _.orderBy(
          _.filter(samples, (sample) => {
            const completedOrders = getCompletedOrders(sample?.orders);
            if (
              sample?.accepted &&
              completedOrders?.length == sample?.orders?.length
            ) {
              return sample;
            }
          }),
          ["dateCreated", "priorityOrderNumber"],
          ["asc", "asc"]
        ),
        (sample) => {
          if (!props?.searchingText && !props?.department) {
            return sample;
          } else if (props?.searchingText && props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1 &&
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (props?.searchingText && !props?.department) {
            if (
              sample?.searchingText
                ?.toLowerCase()
                .indexOf(props?.searchingText.toLowerCase()) > -1
            ) {
              return sample;
            }
          } else if (!props?.searchingText && props?.department) {
            if (
              sample?.department?.departmentName
                .toLowerCase()
                .indexOf(props?.department?.toLowerCase()) > -1
            ) {
              return sample;
            }
          }
        }
      ) || [];

    const filteredCompletedSamplesForPatient = _.filter(
      filteredCompletedSamples,
      (completedSample) => {
        return completedSample?.patient?.uuid == props?.patientUuid
          ? true
          : false;
      }
    );

    const groupedByMRN = _.groupBy(filteredCompletedSamplesForPatient, "mrn");

    let whats = _.map(Object.keys(groupedByMRN), (key) => {
      const samplesKeyedByDepartments = _.groupBy(
        groupedByMRN[key],
        "departmentName"
      );

      return {
        mrn: key,
        patient: groupedByMRN[key][0]?.patient,
        departments: _.map(Object.keys(samplesKeyedByDepartments), (dep) => {
          return {
            departmentName: dep,
            samples: samplesKeyedByDepartments[dep],
          };
        }),
      };
    });

    return whats?.length > 0 ? whats[0] : null;
  }
);
