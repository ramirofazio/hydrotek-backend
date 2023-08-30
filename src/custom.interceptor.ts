import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

export class CustomInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log("request intercepting", { context });

    return handler.handle().pipe(
      map((data) => {
        console.log("response intercepting", data);
        return data;
      }),
    );
  }
}
