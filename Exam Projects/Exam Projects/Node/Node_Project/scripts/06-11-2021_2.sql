USE [ExamsDB]
GO
/****** Object:  StoredProcedure [dbo].[spAddUserExam]    Script Date: 12-11-2021 03:42:55 ******/
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

CREATE OR ALTER PROCEDURE [dbo].[spAddUserExam]
	@UserQuestionList UserQuestionList readonly 

AS
BEGIN

    insert into [dbo].[user_exam_question](question_id, [user_id] , exam_id , answer)
    select question_id, [user_id] , exam_id , answer from @UserQuestionList

END
GO
/****** Object:  StoredProcedure [dbo].[spGetExamId]    Script Date: 12-11-2021 03:42:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spGetExamId] @UserId = 4 , @ExamId = 5
*/

CREATE OR ALTER PROCEDURE [dbo].[spGetExamId]
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
/****** Object:  StoredProcedure [dbo].[spGetExams]    Script Date: 12-11-2021 03:42:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spGetExams] @UserId = 4
*/

CREATE OR ALTER PROCEDURE [dbo].[spGetExams]
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
/****** Object:  StoredProcedure [dbo].[spGetUsers]    Script Date: 12-11-2021 03:42:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spGetUsers]
*/

CREATE OR ALTER PROCEDURE [dbo].[spGetUsers]
AS
BEGIN

	select email , id , firstname , lastname , user_type , created_at , is_approved from users

END
GO
/****** Object:  StoredProcedure [dbo].[spUploadExamQuestions]    Script Date: 12-11-2021 03:42:55 ******/
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

CREATE OR ALTER PROCEDURE [dbo].[spUploadExamQuestions]
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
/****** Object:  StoredProcedure [dbo].[spUserLogin]    Script Date: 12-11-2021 03:42:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spUserLogin] @Email = 'ram@gmail.com'
*/

CREATE OR ALTER PROCEDURE [dbo].[spUserLogin]
	@Email varchar(100)
AS
BEGIN

	select * from users where email = @Email and (is_approved = 1)

END
GO
/****** Object:  StoredProcedure [dbo].[spUserRegister]    Script Date: 12-11-2021 03:42:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
 exec [dbo].[spUserRegister] @Email = 'ram@gmail.com' , @Password = '12345' , 
 @Firstname = 'ram' , @Lastname = 'krishna' , @UserType = 'admin'
*/

CREATE OR ALTER PROCEDURE [dbo].[spUserRegister] 
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
