import { FilterOrdersByOrderPipe } from "./filter-orders-by-order.pipe";

describe("FilterOrdersByOrderPipe", () => {
  it("create lab fields", () => {
    const pipe = new FilterOrdersByOrderPipe();
    expect(pipe).toBeTruthy();
  });
});
