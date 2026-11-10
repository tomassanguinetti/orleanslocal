# Security Specification for Orléans Local Firestore Rules

## 1. Data Invariants

1. **Businesses (`/businesses/{businessId}`)**:
   - Publicly readable by any resident or visitor.
   - Creation, direct edits, and deletion restricted to authenticated Admins (`isAdmin()`).
   - Business ID must be a safe alphanumeric string (`isValidId(businessId)`).
   - Average rating must be between 0 and 5, reviewCount non-negative.

2. **Reviews (`/reviews/{reviewId}`)**:
   - Publicly readable to encourage open community recommendations.
   - Review creation requires an authenticated user with verified identity: `request.auth.uid == incoming().authorId`.
   - The referenced target business must exist (`exists(/databases/$(database)/documents/businesses/$(incoming().businessId))`).
   - Rating must be an integer or float between 1 and 5.
   - Updating or deleting reviews is restricted to the review author (`request.auth.uid == existing().authorId`) or an admin.

3. **Submissions (`/submissions/{submissionId}`)**:
   - Submissions can be created by authenticated users, with `incoming().userId == request.auth.uid` and initial status `'pending'`.
   - Reading submissions is permitted for the submitter (`resource.data.userId == request.auth.uid`) or admins (`isAdmin()`).
   - Updating submission status (e.g., `'approved'` or `'rejected'`) is strictly restricted to Admins.
   - Submitter cannot self-approve their submission.

4. **Claims (`/claims/{claimId}`)**:
   - Authenticated business owners can submit claims: `incoming().userId == request.auth.uid`, status `'pending'`.
   - Read access is restricted to the claimant (`resource.data.userId == request.auth.uid`) or admins (`isAdmin()`).
   - Status updates are restricted to Admins.

5. **Saved Places (`/users/{userId}/saved/{businessId}`)**:
   - Strictly private to the owning user (`request.auth.uid == userId`).
   - Path variable `{userId}` must match `request.auth.uid`.
   - Path variable `{businessId}` must be valid ID.

6. **Admins (`/admins/{userId}`)**:
   - Admin registry document; readable by authenticated users or admins.
   - Never writable from untrusted client requests.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Spoofed Review Author Payload**:
   - Attempt to post a review under another user's `authorId`.
   - Expected: `PERMISSION_DENIED`.

2. **Orphaned Review Payload**:
   - Attempt to post a review pointing to a non-existent `businessId: "fake-ghost-business-id"`.
   - Expected: `PERMISSION_DENIED`.

3. **Rating Boundary Violation Payload**:
   - Attempt to post a review with `rating: 99` or `rating: -1`.
   - Expected: `PERMISSION_DENIED`.

4. **Massive Character Flooding Attack**:
   - Attempt to write a review with text length > 10,000 characters to trigger denial of wallet.
   - Expected: `PERMISSION_DENIED`.

5. **Direct Business Injection Payload**:
   - Non-admin user attempting to directly `create` an unvetted business in `/businesses`.
   - Expected: `PERMISSION_DENIED`.

6. **Self-Approval Submission Privilege Escalation**:
   - Regular user submitting a new business with `status: "approved"` rather than `"pending"`.
   - Expected: `PERMISSION_DENIED`.

7. **Shadow Update on Submission**:
   - Regular user updating an existing submission to switch `status` from `"pending"` to `"approved"`.
   - Expected: `PERMISSION_DENIED`.

8. **Foreign User Saved Place Snooping**:
   - User `user_abc` attempting to read `/users/user_xyz/saved`.
   - Expected: `PERMISSION_DENIED`.

9. **Foreign User Saved Place Hijack**:
   - User `user_abc` attempting to create/write bookmarks inside `/users/user_xyz/saved/b1`.
   - Expected: `PERMISSION_DENIED`.

10. **Admin Escalation Injection**:
    - Unauthenticated or non-admin user trying to create `/admins/{myUid}`.
    - Expected: `PERMISSION_DENIED`.

11. **Path Variable Poisoning**:
    - Request targeting a document with a 2,000-character corrupted ID string.
    - Expected: `PERMISSION_DENIED`.

12. **Immutable Field Tampering on Review**:
    - User attempting to mutate `businessId` or `authorId` on an existing review.
    - Expected: `PERMISSION_DENIED`.
