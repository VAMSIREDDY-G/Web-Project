USE [master]
GO
/****** Object:  Database [ExamsDB]    Script Date: 12-11-2021 17:53:07 ******/
CREATE DATABASE [ExamsDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ExamsDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\ExamsDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ExamsDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\ExamsDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [ExamsDB] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ExamsDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ExamsDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ExamsDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ExamsDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ExamsDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ExamsDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [ExamsDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ExamsDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ExamsDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ExamsDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ExamsDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ExamsDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ExamsDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ExamsDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ExamsDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ExamsDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ExamsDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ExamsDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ExamsDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ExamsDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ExamsDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ExamsDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ExamsDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ExamsDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [ExamsDB] SET  MULTI_USER 
GO
ALTER DATABASE [ExamsDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ExamsDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ExamsDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ExamsDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ExamsDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ExamsDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [ExamsDB] SET QUERY_STORE = OFF
GO
USE [ExamsDB]
GO
/****** Object:  UserDefinedTableType [dbo].[ExamList]    Script Date: 12-11-2021 17:53:07 ******/
CREATE TYPE [dbo].[ExamList] AS TABLE(
	[question] [nvarchar](max) NOT NULL,
	[option1] [nvarchar](max) NOT NULL,
	[option2] [nvarchar](max) NOT NULL,
	[option3] [nvarchar](max) NOT NULL,
	[option4] [nvarchar](max) NOT NULL,
	[answer] [nvarchar](max) NOT NULL
)
GO
/****** Object:  UserDefinedTableType [dbo].[UserQuestionList]    Script Date: 12-11-2021 17:53:07 ******/
CREATE TYPE [dbo].[UserQuestionList] AS TABLE(
	[question_id] [bigint] NOT NULL,
	[exam_id] [bigint] NOT NULL,
	[answer] [nvarchar](max) NOT NULL,
	[user_id] [bigint] NOT NULL
)
GO
/****** Object:  Table [dbo].[exam_questions]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[exam_questions](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[exam_id] [bigint] NOT NULL,
	[question] [nvarchar](max) NOT NULL,
	[option1] [nvarchar](max) NOT NULL,
	[option2] [nvarchar](max) NOT NULL,
	[option3] [nvarchar](max) NOT NULL,
	[option4] [nvarchar](max) NOT NULL,
	[answer] [nvarchar](max) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[exams]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[exams](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](max) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_exam_question]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_exam_question](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [bigint] NOT NULL,
	[exam_id] [bigint] NOT NULL,
	[question_id] [bigint] NOT NULL,
	[answer] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[password] [nvarchar](max) NOT NULL,
	[firstname] [varchar](100) NULL,
	[lastname] [varchar](100) NULL,
	[created_at] [datetime] NULL,
	[user_type] [varchar](100) NULL,
	[is_approved] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [is_approved]
GO
/****** Object:  StoredProcedure [dbo].[spAddUserExam]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 declare @data UserQuestionList
 insert into @data(question_id, [user_id] , exam_id , answer)
 select 4 , 4 , 5 , 'option1'

 exec [dbo].[spAddUserExam] @UserQuestionList = @data
*/

CREATE PROCEDURE [dbo].[spAddUserExam]
	@UserQuestionList UserQuestionList readonly 

AS
BEGIN

    insert into [dbo].[user_exam_question](question_id, [user_id] , exam_id , answer)
    select question_id, [user_id] , exam_id , answer from @UserQuestionList

END
GO
/****** Object:  StoredProcedure [dbo].[spGetExamId]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spGetExamId] @UserId = 4 , @ExamId = 5
*/

CREATE PROCEDURE [dbo].[spGetExamId]
  @UserId BIGINT , 
  @ExamId BIGINT
AS
BEGIN

    select eq.* , 
	(
	  select top 1 answer from user_exam_question where question_id = eq.id and user_id = @UserId and exam_id = @ExamId
	) as user_answer,
	(
	  select count(id) from user_exam_question where exam_id = @ExamId and user_id = @UserId
	) as isCompleted
	from exam_questions eq where eq.exam_id = @ExamId

END
GO
/****** Object:  StoredProcedure [dbo].[spGetExams]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spGetExams] @UserId = 4
*/

CREATE PROCEDURE [dbo].[spGetExams]
  @UserId BIGINT
AS
BEGIN

	select ex.* , 
	(
	  select count(ueq.id) from user_exam_question ueq
	  inner join exam_questions eq on eq.id = ueq.question_id and eq.exam_id = ex.id
	  where ueq.exam_id = ex.id and ueq.user_id = @UserId and ueq.answer = eq.answer
	) as markes , 
	(
	  select count(id) from user_exam_question where exam_id = ex.id and user_id = @UserId
	) as isCompleted
	from exams ex

END
GO
/****** Object:  StoredProcedure [dbo].[spGetUsers]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spGetUsers]
*/

CREATE PROCEDURE [dbo].[spGetUsers]
AS
BEGIN

	select email , id , firstname , lastname , user_type , created_at , is_approved from users

END
GO
/****** Object:  StoredProcedure [dbo].[spUploadExamQuestions]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 declare @data ExamList
 insert into @data([question], [option1] , [option2] , [option3] , [option4] , [answer])
 select 'test','a', 'b','c', 'd','option3'

 exec [dbo].[spUploadExamQuestions] @ExamList = @data, @title = 'test1'
*/

CREATE PROCEDURE [dbo].[spUploadExamQuestions]
	@ExamList ExamList readonly ,
	@Title nvarchar(max)
AS
BEGIN

	insert into exams(name) values(@Title)
	declare @examId BIGINT = SCOPE_IDENTITY();

	insert into exam_questions(question, option1 , option2 , option3 , option4 , answer , exam_id)
    select question, option1 , option2 , option3 , option4 , answer, @examId as exam_id from @ExamList 

END
GO
/****** Object:  StoredProcedure [dbo].[spUserLogin]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spUserLogin] @Email = 'ram@gmail.com'
*/

CREATE PROCEDURE [dbo].[spUserLogin]
	@Email varchar(100)
AS
BEGIN

	select * from users where email = @Email and (is_approved = 1)

END
GO
/****** Object:  StoredProcedure [dbo].[spUserRegister]    Script Date: 12-11-2021 17:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spUserRegister] @Email = 'ram@gmail.com' , @Password = '12345' , 
 @Firstname = 'ram' , @Lastname = 'krishna' , @UserType = 'admin'
*/

CREATE PROCEDURE [dbo].[spUserRegister] 
	@Email varchar(100),
	@Password nvarchar(max),
	@Firstname varchar(100),
	@Lastname varchar(100),
	@UserType varchar(100)

AS
BEGIN

    if exists(select * from users where email = @Email)
	begin  
      select 'User already exists' as message
	end 
	else 
	begin
	  if(@UserType != 'teacher')
	  begin
	    insert into users(email,password,firstname,lastname,created_at,user_type,is_approved)
	    select @Email , @Password , @Firstname , @Lastname , GETUTCDATE() , @UserType, 1
	  end
	  else 
	  begin
	    insert into users(email,password,firstname,lastname,created_at,user_type)
	    select @Email , @Password , @Firstname , @Lastname , GETUTCDATE() , @UserType
	  end
    end
END
GO
USE [master]
GO
ALTER DATABASE [ExamsDB] SET  READ_WRITE 
GO
