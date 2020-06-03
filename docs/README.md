# README

## webpb使用

### 命令

- 前端编译TS

`java -jar ${WEBPB} --type=TS --proto_path=${INPUT_PATH} --out=${OUTPUT_PATH}`

- 后端编译JAVA

`java -jar ${WEBPB} --type=WIRE --proto_path=${INPUT_PATH} --out=${OUTPUT_PATH}`

### 示例

`java -jar webpb.jar --type=TS --proto_path=docs/proto --out=wxapp/src/protocol`

### Intellij Idea配置

[配置图片](./images/idea_webpb_task.png)
