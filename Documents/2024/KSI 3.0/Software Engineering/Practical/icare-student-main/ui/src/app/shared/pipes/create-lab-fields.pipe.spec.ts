import { CreateLabFieldsPipe } from "./create-lab-fields.pipe";

describe("CreateLabFieldsPipe", () => {
  it("create lab fields", () => {
    const pipe = new CreateLabFieldsPipe();
    expect(pipe).toBeTruthy();
  });
});
