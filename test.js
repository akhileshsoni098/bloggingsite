// function foo(ar)
// {
//     for(let i=0;i<=ar.length-1 ; i++)
//     {
//         temp=0;
//         for(let j=i+1;j<ar.length;j++)
//         {
//         if(ar[i]>ar[j])
//         {
//             temp=ar[i]
//             ar[i]=ar[j]
//             ar[j]=temp
//         }
//         }    
//     }
//     return console.log(ar);
//     // for(let i=0;i<=ar.length-1;i++)
//     // {
//     //     if(ar[i]>=k)
//     //         {
//     //            return ar[i];
//     //         }
//     // }
// }
// const a=[-8,7,6,-4,-3,1,2]
// const k=5;
// console.log(foo(a,k));
// //Given an array of integers, replace every element by its frequency in the array.
// function foo(ar)
// {
//     const a=[];
//     for(let i=0 ;i<=ar.length-1;i++)
//     {
//         let count=0;
//         const x=ar[i];
//         for(let j=0;j<ar.length;j++)
//         {
//             if(x==ar[j])
//             {
//                 count++;   
//             }  
//         }
//            a.push(count);  
//     }
//     return a;
// }
// const a=[-1 ,-2 ,5 ,2 ,2 ,5]//[1,3,2,3,3,2]
// console.log(foo(a))\

// Given an array A of N positive integers, find the number of distinct pairs (A[i], A[j]) whose sum exists in the given array for all 
//0 ≤ i < j < N. Note: While repeating pairs will not be counted again. And we can’t make a pair using the same elements again. Eg : (2, 1) and (1, 2) will be considered as only one pair.
// [1,2,3,5,6,7]=[3,6,5,7]
// (1+2)=3;(1+3)=4!; (1+5)=6;(1+7)=!8
// //1 => 2;
// (2+3)=5;(2+5)=7;(2+6)=!8;(2+7)=!9
// //2=>2;
//lineby line
// [1, 5, 6, 4, -1, 5, 10]=[6,5,4,10,10,5]//6
// //1
// (1+5)=6;(1+6)=!7;(1+4)=5;(1+ -1)=!0;!(1+5)=6;(1+10)=!11
// //2
// (5+6)=!11;(5+4)=!9;(5+ -1)=4;(5+5)=10;(5+10)=!15
// //3
// (6+4)=10;(6-1)=5;
// //new sort
// [4,5]//2
// [1, 5, 6, 4, -1, 5, 10]=[-1,1,4,5,5,6,10]//
// //1
// (-1+1)=!0;(-1+4)=!3;(-1+5)=4;!(-1+5)=4;(-1+6)=5;(-1+10)=!9
// //2
// (1+4)=5
