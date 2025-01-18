export function getFilteredIssueItems(requisitionItems: any[], issues: any[]){
    let issueItems = [] 
    issues?.forEach((issue) => {
        issue?.issueItems?.forEach((issueItem) => {
            issueItems = [
                ...issueItems,
                {
                ...issueItem,
                creator: issue?.creator,
                created: issue?.created,
                status: !issueItem?.issueItemStatuses?.length
                    ? "ISSUED"
                    : issueItem?.issueItemStatuses[
                        issueItem.issueItemStatuses.length - 1
                    ]?.status
                    ? issueItem?.issueItemStatuses[
                        issueItem.issueItemStatuses.length - 1
                    ]?.status
                    : "ISSUED",
                }
            ]
        })
        })

    let unissuedItems = requisitionItems?.map((requisitionItem) => {
        let issuedItems = issueItems?.filter((issueItem) => issueItem?.item?.uuid === requisitionItem?.item?.uuid)
        if(!issuedItems?.length || issuedItems.length === 0){
            return {
              ...requisitionItem,
              status: requisitionItem?.requisitionItemStatuses?.length
                ? requisitionItem?.requisitionItemStatuses[
                    requisitionItem?.requisitionItemStatuses?.length -1
                  ]?.status
                : "PENDING",
            };
        }
        return null
    }).filter(item => item)

    
    return [
        ...issueItems,
        ...unissuedItems
    ]
}