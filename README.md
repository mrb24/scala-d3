# scala-d3

Basic setup of d3.js, the Data Driven Documents Javascript library, to run in a JVM using Rhino and a modified version of domino.


## Compiling scala-d3

To compile from source, check out the code, and use one of the following to compile and run it.
```
$> git clone https://github.com/mrb24/scala-d3.git
...
$> cd scala-d3
$> sbt run
```
OR
```
$> sbt assembly
```
and run the created fat scala-d3.jar


## Adding Plots

add the plot Javascript file to the ./js directory and add a function to the D3.scala object to provide the data and generate/output the plot.  See the existing examples graph.js, bar_graph.js, ect.

