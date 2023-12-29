import {test} from "playwright/test";


export function step(stepDefinition?: string, box?: boolean) {
    return function actualDecorator(originalMethod: Function, context: ClassMethodDecoratorContext) {
        return function replacementMethod(this: any, ...args: any): Promise<any> {
            const pageName: string = convertCamelCaseToText(this.constructor.name);
            const methodName: string = convertCamelCaseToText(context.name as string);
            const message: string = `${pageName}: ${stepDefinition || methodName};
            ${args.length? ` Step args: [${args.map((a: any) => JSON.stringify(a)).join(',')}]`: ''}`;
            return test.step( message, () => {
                return originalMethod.call(this, ...args);
            }, { box: box })
        }
    }
}

function convertCamelCaseToText(camelCaseStr: string): string {
    const result: string = camelCaseStr.replace(/([A-Z])/g, " $1");
    return  result.charAt(0).toUpperCase() + result.slice(1);
}