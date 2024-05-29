import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const updatedItem = await updateTodoItem(event.pathParameters.id, body);
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

const updateTodoItem = async (id, updates) => {
    const params = {
        TableName: "ToDoTable",
        Key: { id: { S: id } },
        UpdateExpression: "set task = :task, completed = :completed",
        ExpressionAttributeValues: {
            ":task": { S: updates.task },
            ":completed": { BOOL: updates.completed },
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
