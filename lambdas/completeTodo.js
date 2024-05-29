import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

export const handler = async (event) => {
    try {
        const updatedItem = await completeTodoItem(event.pathParameters.id);
        return {
            statusCode: 200,
            body: JSON.stringify(updatedItem),
            headers: { "Access-Control-Allow-Origin": "*" },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const completeTodoItem = async (id) => {
    const params = {
        TableName: "ToDoTable",
        Key: { id: { S: id } },
        UpdateExpression: "set completed = :completed",
        ExpressionAttributeValues: {
            ":completed": { BOOL: true },
        },
        ReturnValues: "UPDATED_NEW",
    };
    const command = new UpdateItemCommand(params);
    const data = await ddbClient.send(command);
    return data.Attributes;
};

const errorResponse = (errorMessage, awsRequestId) => {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: errorMessage, reference: awsRequestId }),
    };
};
