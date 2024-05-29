import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const newItem = {
            id: { S: body.id },  // Assuming the ID is provided in the request body and it's a string
            task: { S: body.task },
            completed: { BOOL: false },
        };
        await createTodoItem(newItem);
        return {
            statusCode: 201,
            body: JSON.stringify(newItem),
            headers: { "Access-Control-Allow-Origin": "*" },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const createTodoItem = async (item) => {
    const params = { TableName: "ToDoTable", Item: item };
    const command = new PutItemCommand(params);
    await ddbClient.send(command);
};

const errorResponse = (errorMessage, awsRequestId) => {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: errorMessage, reference: awsRequestId }),
    };
};
