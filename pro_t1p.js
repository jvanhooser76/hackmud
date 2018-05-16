function (
    // ═════════════════════════════════════════════════════════════
    //            Pro T1p - T1 lock cracker for ｈａｃｋｍｕｄ
    // ═════════════════════════════════════════════════════════════
    //            https://github.com/ScottHamper/hackmud
    //
    // I created this script as a challenge to see how much T1
    // cracker functionality I could pack into a single <= 500 char
    // script without needing to store anything in the database.
    //
    // Regarding performance, the script is mostly optimized for
    // each of the lock types (in terms of guesses needed):
    //
    //                 ┌──────────────┬──────────────┐
    //                 │ Theoretical  │   Pro T1p    │
    //                 ├──────┬───────┼──────┬───────┤
    //                 │ Best │ Worst │ Best │ Worst │
    //        ┌────────┼──────┼───────┼──────┼───────┤
    //        │ EZ_21  │  1   │   3   │  1   │   3   │
    //        │ EZ_35  │  1   │   12  │  2   │   13  │
    //        │ EZ_40  │  1   │   27  │  2   │   28  │
    //        │ c001   │  1   │   8   │  2   │   9   │
    //        │ c002   │  1   │   8   │  2   │   9   │
    //        │ c003   │  1   │   8   │  3   │   10  │
    //        │ l0cket │  1   │   8   │  1   │   8   │
    //        └────────┴──────┴───────┴──────┴───────┘
    //
    // ─────────────────────────────────────────────────────────────

    // Key for previous cracked lock/parameter
    z,

    // Args;
    // Response from target
    r,

    // Name of the current lock
    l,

    // Target loc to crack
    t = r.t.call,

    // Function to split string lines
    s = a => a[0].split`
`,

    // Function that maps string lines into an array of numbers
    n = a => s(a).map(l => l.length),

    // Colors
    c = s`red
orange
yellow
lime
green
cyan
blue
purple`,

    // Parameters/passphrases for lock;
    // Storage for lock key collections
    p = {
        // EZ_21, EZ_35, EZ_40
        E: s`release
open
unlock`,

        // digit (EZ_35)
        d: n`
 
  
   
    
     
      
       
        
         `,

        // ez_prime (EZ_40)
        e: n`  
   
     
       
           
             
                 
                   
                       
                             
                               
                                     
                                         
                                           
                                               
                                                     
                                                           
                                                             
                                                                   
                                                                       
                                                                         
                                                                               
                                                                                   
                                                                                         
                                                                                                 `,

        // l0cket
        l: s`vc2c7q
cmppiq
tvfkyq
uphlaw
6hh8xw
xwz7ja
sa23uw
72umy0`
    }
) {
    // Get an initial response from the target to kick things off.
    r = t(p)

    for (;
        // After any single lock has been cracked, `r` will be either:
        // - "`NLOCK_UNLOCKED`\nConnection terminated."
        // - "`NLOCK_UNLOCKED` {LOCK}\n`VLOCK_ERROR`\nDenied access by {MANUFACTURER} `N{LOCK}` lock."
        // Only the "Connection terminated" response has "nn" in it.
        !r.match`nn`;

        // This happens after the loop body below.
        // Gets the appropriate key array for the current lock,
        // and brute forces the lock.
        z = (p[l[0]] || (
            l[4] ? [
                +l[3] ?

                // c003_triad_x or c002_complement
                c[(c.indexOf(z) + (l[11]|4)) % 8]

                // color_digit
                : z.length
            ]

            // c00x
            : c

        // Cracking function - tries each value in an array for
        // the current lock/parameter, and short-circuits once
        // it finds the correct value.
        // Only the "is not the correct {PARAMETER}" message contains "th".
        )).find(v => !(p[l] = v, r = t(p)).match`th`)
    )
        // Find the last blue-colored word in the last line of output.
        // This should be the name of the next lock/parameter to crack,
        // but will throw an exception if the loc no longer exists or
        // is currently breached.
        [,l] = r.match`N(\\w+).*$`
}
