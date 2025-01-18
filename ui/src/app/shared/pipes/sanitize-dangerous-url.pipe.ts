import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sanitizeDangerousUrl",
})
export class SanitizeDangerousUrlPipe implements PipeTransform {
  transform(url: string, args: unknown[]): any {
    return null;
  }
}
