USE [ExamsDB]
GO
CREATE TABLE [dbo].[users](
	id BIGINT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	[email] [varchar](100) NOT NULL,
	[password] [nvarchar](max) NOT NULL,
	[firstname] [varchar](100) NULL,
	[lastname] [varchar](100) NULL,
	[created_at] [datetime] NULL,
	[user_type] [varchar](100) NULL,
	[is_approved] bit NOT NULL DEFAULT 0
)

GO
CREATE TABLE [dbo].[exams](
	id BIGINT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	[name] [nvarchar](max) NOT NULL
)

GO
CREATE TABLE [dbo].[exam_questions](
	id BIGINT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	[exam_id] BIGINT NOT NULL,
	[question] [nvarchar](max) NOT NULL,
	[option1] [nvarchar](max) NOT NULL,
        [option2] [nvarchar](max) NOT NULL,
        [option3] [nvarchar](max) NOT NULL,
        [option4] [nvarchar](max) NOT NULL,
	[answer] [nvarchar](max) NOT NULL
)
GO

GO
CREATE TABLE [dbo].[user_exam_question](
	id BIGINT NOT NULL PRIMARY KEY IDENTITY (1, 1),
	[user_id] BIGINT NOT NULL,
	[exam_id] BIGINT NOT NULL,
	[question_id] BIGINT NOT NULL,
	[answer] [nvarchar](max) NULL
)

GO
CREATE TYPE [dbo].[ExamList] AS TABLE(
	question nvarchar(max) NOT NULL,
	option1 nvarchar(max) NOT NULL,
	option2 nvarchar(max) NOT NULL,
	option3 nvarchar(max) NOT NULL,
	option4 nvarchar(max) NOT NULL,
	answer nvarchar(max) NOT NULL
)
GO
CREATE TYPE [dbo].[UserQuestionList] AS TABLE(
	question_id BIGINT NOT NULL,
	exam_id BIGINT NOT NULL,
	answer nvarchar(max) NOT NULL,
	[user_id] BIGINT NOT NULL
)
GO
