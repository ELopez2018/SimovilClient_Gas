USE [ESTACION]
GO
/****** Object:  UserDefinedFunction [dbo].[SimovilDiferenciaLectura]    Script Date: 01/31/2020 10:48:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[SimovilDiferenciaLectura]
(
	-- Add the parameters for the function here
	@LEC_INI DECIMAL(15,3),
	@LEC_FIN DECIMAL(15,3)
)
RETURNS DECIMAL(15,3)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @DIF DECIMAL(15,3)

	SELECT @DIF = @LEC_FIN - @LEC_INI
	IF @DIF < 0 AND @LEC_INI > 99000
		SELECT @DIF = 100000 + @LEC_FIN - @LEC_INI
		
	RETURN @DIF

END
GO
/****** Object:  StoredProcedure [dbo].[SimovilLecturaTurno2]    Script Date: 01/31/2020 10:48:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SimovilLecturaTurno2]
	-- Add the parameters for the stored procedure here
	@fecha VARCHAR(8) = NULL
AS

BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    IF @fecha IS NULL
		SELECT @fecha = CONVERT(VARCHAR(8),DATEADD(d,-1,GETDATE()),112)

	SELECT CONVERT(CHAR(10), dbo.Finteger(fecha), 120) fecha, 
		   COD_MAN manguera, 
		   codigoalterno codArt, 
		   LECT_FIN1 lecFin,
		   TURN_LEC.PRECIO precio
	FROM   TURN_LEC
		   INNER JOIN ARTICULO
				   ON ARTICULO.COD_ART = TURN_LEC.COD_ART1
	WHERE  dbo.Finteger(FECHA) = @fecha
		   AND NUM_TUR = (SELECT MAX(L.NUM_TUR) 
						  FROM	 TURN_LEC L
						  WHERE  dbo.Finteger(L.FECHA) = @fecha
								 AND L.COD_MAN = TURN_LEC.COD_MAN)

END
GO
/****** Object:  StoredProcedure [dbo].[SimovilLecturaTurno]    Script Date: 01/31/2020 10:48:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SimovilLecturaTurno]
	-- Add the parameters for the stored procedure here
	@fecha VARCHAR(8) = NULL
AS

BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    IF @fecha IS NULL
		SELECT @fecha = CONVERT(VARCHAR(8),DATEADD(d,-1,GETDATE()),112)

	SELECT CONVERT(CHAR(10), dbo.Finteger(l.fecha), 120) AS fechaTurno,
		   l.num_tur,
		   --Sum(l.lect_fin1 - l.lect_ini1)                AS diferencia,
		   dbo.SimovilDiferenciaLectura(Sum(l.lect_ini1), Sum(l.lect_fin1)) AS diferencia,
		   a.codigoalterno,
		   --CASE WHEN l.PRECIO > 2000 THEN l.PRECIO ELSE l.PRECIO  END AS precio
		   l.PRECIO AS precio
	FROM   turn_lec AS l (nolock)
		   INNER JOIN articulo AS a(nolock)
				   ON l.cod_art1 = a.cod_art
	WHERE  1 = 1
		   AND l.fecha BETWEEN CONVERT(NVARCHAR, dbo.Fjuliana(@fecha)) AND
								   CONVERT(NVARCHAR, dbo.Fjuliana(@fecha))
	GROUP  BY l.fecha,
			  l.num_tur,
			  codigoalterno,
			  l.precio
	ORDER  BY l.fecha,
			  l.num_tur 
END
GO
