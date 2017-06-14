name := "Mimir-Core"
version := "0.2-SNAPSHOT"
organization := "info.mimirdb"
scalaVersion := "2.11.11"

dependencyOverrides += "org.scala-lang" % "scala-library" % scalaVersion.value

// Needed to avoid cryptic EOFException crashes in forked tests
// in Travis with `sudo: false`.
// See https://github.com/sbt/sbt/issues/653
// and https://github.com/travis-ci/travis-ci/issues/3775
javaOptions += "-Xmx2G"

scalacOptions ++= Seq(
  "-feature"
)

connectInput in run := true
outputStrategy in run := Some(StdoutOutput)

resolvers += "MVNRepository" at "http://mvnrepository.com/artifact/"

libraryDependencies ++= Seq(
  
  "commons-logging"              %   "commons-logging"         % "1.2",
  "org.mozilla"					 % 	 "rhino" 				   % "1.7.7.1",
  "com.google.guava" 			 %   "guava" 				   % "22.0",
  "org.apache.xmlgraphics" 		 %   "fop" 					   % "2.2",
  "org.apache.xmlgraphics" 		 % 	 "batik-transcoder"		   % "1.9",
  "org.apache.xmlgraphics"		 %	 "batik-codec"			   % "1.9"
)



scalacOptions in Test ++= Seq("-Yrangepos")

parallelExecution in Test := false

resolvers ++= Seq("snapshots", "releases").map(Resolver.sonatypeRepo)

fork := false

testOptions in Test ++= Seq( Tests.Argument("junitxml"), Tests.Argument("console") )

////// Assembly Plugin //////
// We use the assembly plugin to create self-contained jar files
// https://github.com/sbt/sbt-assembly

test in assembly := {}
assemblyJarName in assembly := "scala-d3.jar"
mainClass in assembly := Some("edu.buffalo.odin.scalad3.D3")

assemblyMergeStrategy in assembly := {
  case PathList("org","w3c","dom","events", xs @ _*)         => MergeStrategy.first
  case x =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(x)
}