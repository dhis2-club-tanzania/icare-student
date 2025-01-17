export function combineFormMembersWithBillableItemsDetails(
  members,
  billableItems
) {
  // TODO: Billable items should be returned via an api by passinng the specific department
  return members.map((member) => {
    return {
      ...member,
      isBillable: true,
      billingDetails: null,
    };
  });
}
